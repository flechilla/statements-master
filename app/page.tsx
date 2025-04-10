import { StatementViewer } from "@/components/statement"
import { CardStatements, StatementData } from "@/lib/utils"
import fs from 'fs'
import path from 'path'

// Server-side function to get all statements
async function getAllStatements(): Promise<CardStatements[]> {
  const monthMap: Record<string, string> = {
    '01_january': 'January',
    '02_feb': 'February',
    '03_march': 'March',
    '04_april': 'April',
    '05_may': 'May',
    '06_june': 'June',
    '07_july': 'July',
    '08_august': 'August',
    '09_september': 'September',
    '10_octuber': 'October',
    '11_november': 'November',
    '12_december': 'December'
  }

  // Get card folders
  const dataDir = path.join(process.cwd(), 'data')
  const cardFolders = fs.readdirSync(dataDir).filter(folder => 
    fs.statSync(path.join(dataDir, folder)).isDirectory()
  )
  
  return cardFolders.map(folder => {
    const folderPath = path.join(process.cwd(), 'data', folder)
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'))
    
    const statements = files.map(file => {
      const monthKey = file.replace('.json', '')
      const monthName = monthMap[monthKey] || monthKey
      
      // Get statement data
      const filePath = path.join(process.cwd(), 'data', folder, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const data: StatementData = JSON.parse(fileContents)
      
      return {
        month: monthName,
        monthKey,
        data
      }
    }).sort((a, b) => {
      // Sort by month number extracted from the filename (01, 02, etc.)
      const aNum = parseInt(a.monthKey.substring(0, 2))
      const bNum = parseInt(b.monthKey.substring(0, 2))
      return aNum - bNum
    })
    
    return {
      cardName: folder,
      statements
    }
  })
}

export default async function Home() {
  const cardStatements = await getAllStatements()

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statement Master</h1>
          <p className="text-muted-foreground">
            Visualize and track your business expenses from credit card statements
          </p>
        </header>

        <main>
          <StatementViewer cardStatements={cardStatements} />
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Statement Master | Business Expense Tracker</p>
        </footer>
      </div>
    </div>
  )
}
