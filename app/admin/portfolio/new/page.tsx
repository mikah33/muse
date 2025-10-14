import PortfolioItemForm from '@/components/admin/PortfolioItemForm'

export default function NewPortfolioItemPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Add Portfolio Item</h1>
          <p className="text-gray-600">Upload a new piece to your portfolio</p>
        </div>

        <PortfolioItemForm />
      </div>
    </div>
  )
}
