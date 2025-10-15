import BulkPortfolioUpload from '@/components/admin/BulkPortfolioUpload'

export default function BulkPortfolioUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Bulk Portfolio Upload</h1>
          <p className="text-gray-600">Upload multiple images at once to create portfolio items</p>
        </div>

        <BulkPortfolioUpload />
      </div>
    </div>
  )
}
