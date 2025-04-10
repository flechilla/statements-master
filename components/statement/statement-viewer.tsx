"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { BusinessExpense, CardStatements, formatCurrency } from "@/lib/utils"

interface StatementViewerProps {
  cardStatements: CardStatements[]
}

interface SelectableExpense extends BusinessExpense {
  id: string;
  isSelected: boolean;
  cardName: string;
  month: string;
}

export function StatementViewer({ cardStatements }: StatementViewerProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [availableMonths, setAvailableMonths] = useState<string[]>([])
  const [selectableExpenses, setSelectableExpenses] = useState<SelectableExpense[]>([])

  // Initialize with the first card selected if any cards exist
  useEffect(() => {
    if (cardStatements.length > 0 && selectedCards.length === 0) {
      const firstCard = cardStatements[0]?.cardName || ""
      setSelectedCards([firstCard])
      
      // Get months for the first card
      updateAvailableMonths([firstCard])
    }
  // We only want this to run once when the component mounts and when cardStatements changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardStatements.length])

  // Update available months when selected cards change
  function updateAvailableMonths(cardNames: string[]) {
    const months = new Set<string>()
    
    cardStatements
      .filter(card => cardNames.includes(card.cardName))
      .forEach(card => {
        card.statements.forEach(statement => {
          months.add(statement.month)
        })
      })
    
    const sortedMonths = Array.from(months).sort()
    setAvailableMonths(sortedMonths)
    
    // Update selected months to include only valid months
    const validSelectedMonths = selectedMonths.filter(month => months.has(month))
    
    // If no valid months are selected but we have available months, select the first one
    if (validSelectedMonths.length === 0 && sortedMonths.length > 0) {
      setSelectedMonths([sortedMonths[0]])
    } else {
      setSelectedMonths(validSelectedMonths)
    }
  }

  // Handle card selection toggle
  const toggleCard = (cardName: string) => {
    let newSelectedCards: string[]
    
    if (selectedCards.includes(cardName)) {
      // Don't allow deselecting the last card
      if (selectedCards.length === 1) return
      newSelectedCards = selectedCards.filter(name => name !== cardName)
    } else {
      newSelectedCards = [...selectedCards, cardName]
    }
    
    setSelectedCards(newSelectedCards)
    updateAvailableMonths(newSelectedCards)
  }

  // Handle month selection toggle
  const toggleMonth = (month: string) => {
    let newSelectedMonths: string[]
    
    if (selectedMonths.includes(month)) {
      // Don't allow deselecting the last month
      if (selectedMonths.length === 1) return
      newSelectedMonths = selectedMonths.filter(m => m !== month)
    } else {
      newSelectedMonths = [...selectedMonths, month]
    }
    
    setSelectedMonths(newSelectedMonths)
  }

  // Get all statements for selected cards and months
  const filteredStatements = useMemo(() => {
    return cardStatements
      .filter(card => selectedCards.includes(card.cardName))
      .flatMap(card => 
        card.statements
          .filter(statement => selectedMonths.includes(statement.month))
          .map(statement => ({
            cardName: card.cardName,
            ...statement
          }))
      );
  }, [cardStatements, selectedCards, selectedMonths])
    
  // Update selectable expenses when filtered statements change
  useEffect(() => {
    // Skip if filteredStatements is empty to avoid unnecessary updates
    if (filteredStatements.length === 0) return;
    
    // Create a map of existing expenses for faster lookup
    const existingExpensesMap = new Map(
      selectableExpenses.map(expense => [expense.id, expense.isSelected])
    );
    
    // Create selectable expenses from filtered statements
    const newSelectableExpenses = filteredStatements.flatMap((statement) => 
      statement.data.business_expenses.map((expense: BusinessExpense, expenseIndex: number) => {
        const id = `${statement.cardName}-${statement.month}-${expenseIndex}`;
        const isSelected = existingExpensesMap.has(id) 
          ? existingExpensesMap.get(id) 
          : true; // Default to selected for new expenses
        
        return {
          ...expense,
          id,
          isSelected,
          cardName: statement.cardName,
          month: statement.month
        };
      })
    );
    
    // Only update if there's an actual change to avoid infinite loops
    const hasChanged = 
      selectableExpenses.length !== newSelectableExpenses.length ||
      newSelectableExpenses.some((expense, index) => {
        const oldExpense = selectableExpenses[index];
        // If item doesn't exist or its ID or selection status is different
        return !oldExpense || 
               oldExpense.id !== expense.id || 
               oldExpense.isSelected !== expense.isSelected;
      });
      
    if (hasChanged) {
      setSelectableExpenses(newSelectableExpenses);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredStatements.length])
  
  // Toggle expense selection
  const toggleExpenseSelection = (expenseId: string) => {
    setSelectableExpenses(prev => 
      prev.map(expense => 
        expense.id === expenseId 
          ? { ...expense, isSelected: !expense.isSelected } 
          : expense
      )
    )
  }
  
  // Toggle all expenses selection
  const toggleAllExpenses = (selected: boolean) => {
    setSelectableExpenses(prev => 
      prev.map(expense => ({ ...expense, isSelected: selected }))
    )
  }

  // Calculate stats for all selected expenses
  const { selectedExpenses, totalExpenses, expenseCount, averageExpense } = useMemo(() => {
    const selected = selectableExpenses.filter(expense => expense.isSelected);
    const total = selected.reduce((sum, expense) => sum + expense.amount, 0);
    const count = selected.length;
    const average = count > 0 ? total / count : 0;
    
    return {
      selectedExpenses: selected,
      totalExpenses: total,
      expenseCount: count,
      averageExpense: average
    };
  }, [selectableExpenses])

  // Format card name for display
  const formatCardName = (name: string) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Business Expenses Visualizer</CardTitle>
        <CardDescription>
          View and manage your business expenses from credit card statements
        </CardDescription>
        
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <h3 className="text-sm mb-2 font-medium">Credit Cards:</h3>
            <div className="flex flex-wrap gap-2">
              {cardStatements.map((card) => (
                <Button
                  key={card.cardName}
                  variant={selectedCards.includes(card.cardName) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCard(card.cardName)}
                  className="mb-1"
                >
                  {formatCardName(card.cardName)}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm mb-2 font-medium">Months:</h3>
            <div className="flex flex-wrap gap-2">
              {availableMonths.map((month) => (
                <Button
                  key={month}
                  variant={selectedMonths.includes(month) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleMonth(month)}
                  className="mb-1"
                >
                  {month}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {selectableExpenses.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                Showing {selectedExpenses.length} of {selectableExpenses.length} transactions
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleAllExpenses(true)}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleAllExpenses(false)}
                >
                  Deselect All
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalExpenses)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Number of Expenses</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{expenseCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Average Expense</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {formatCurrency(averageExpense)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="details">Statement Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Select</TableHead>
                        <TableHead>Card</TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Justification</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectableExpenses.map((expense) => (
                        <TableRow 
                          key={expense.id}
                          className={!expense.isSelected ? "opacity-50" : ""}
                        >
                          <TableCell>
                            <input 
                              type="checkbox" 
                              checked={expense.isSelected}
                              onChange={() => toggleExpenseSelection(expense.id)}
                              className="w-4 h-4"
                            />
                          </TableCell>
                          <TableCell>{formatCardName(expense.cardName)}</TableCell>
                          <TableCell>{expense.month}</TableCell>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{expense.justification}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <div className="space-y-4">
                  {filteredStatements.map((statement, index) => (
                    <Card key={index}>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{formatCardName(statement.cardName)} - {statement.month}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="font-medium">Statement Period:</span> {statement.data.statement_period}
                            </div>
                            <div>
                              <span className="font-medium">Bank:</span> {statement.data.bank_name}
                            </div>
                            <div>
                              <span className="font-medium">Card:</span> {statement.data.card_name}
                            </div>
                            <div>
                              <span className="font-medium">Total Business Expenses:</span> {formatCurrency(statement.data.total_business_expenses)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>Select at least one card and month to view statement data</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}