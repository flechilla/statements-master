import { StatementUploader } from "@/components/statement"

export default function UploadPage() {
  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Statement</h1>
          <p className="text-muted-foreground">
            Upload your credit card statement and let AI extract the transactions
          </p>
        </div>
        <StatementUploader />
      </div>
    </main>
  )
}