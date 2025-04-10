"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the types for our statement data
type Transaction = {
  date: string
  description: string
  amount: number
  category: string
}

type StatementData = {
  statementPeriod: string
  bankName: string
  cardName: string
  transactions: Transaction[]
}

export function StatementUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<StatementData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
    setResult(null)
  }

  const processFile = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create a FormData instance to send the file
      const formData = new FormData()
      formData.append("file", file)

      // Send the file to our API endpoint for processing
      const response = await fetch("/api/statement-processor", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process statement")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Error processing file:", err)
      setError(err instanceof Error ? err.message : "An error occurred during processing")
    } finally {
      setIsProcessing(false)
    }
  }

  const saveStatement = async () => {
    if (!result) return

    try {
      const response = await fetch("/api/statements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      })

      if (!response.ok) {
        throw new Error("Failed to save statement")
      }

      // Clear the form after successful submission
      setFile(null)
      setResult(null)
      setError(null)
      alert("Statement saved successfully!")
    } catch (err) {
      console.error("Error saving statement:", err)
      setError(err instanceof Error ? err.message : "An error occurred while saving")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Statement</CardTitle>
        <CardDescription>
          Upload your credit card statement to extract and analyze transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="statement-file" className="text-sm font-medium">
              Statement File (PDF, CSV, or text file)
            </label>
            <input
              id="statement-file"
              type="file"
              accept=".pdf,.csv,.txt"
              onChange={handleFileChange}
              className="border rounded p-2"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-2">
            <Button
              onClick={processFile}
              disabled={!file || isProcessing}
              className="flex-1"
            >
              {isProcessing ? "Processing..." : "Process Statement"}
            </Button>
            <Button
              onClick={saveStatement}
              disabled={!result || isProcessing}
              variant="outline"
              className="flex-1"
            >
              Save Results
            </Button>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Extracted Information</h3>
              <div className="space-y-2">
                <div><span className="font-medium">Bank:</span> {result.bankName}</div>
                <div><span className="font-medium">Card:</span> {result.cardName}</div>
                <div><span className="font-medium">Period:</span> {result.statementPeriod}</div>
              </div>

              <h4 className="text-md font-semibold">Transactions ({result.transactions.length})</h4>
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-left">Amount</th>
                      <th className="p-2 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.transactions.map((transaction, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{transaction.date}</td>
                        <td className="p-2">{transaction.description}</td>
                        <td className="p-2">${transaction.amount.toFixed(2)}</td>
                        <td className="p-2">{transaction.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}