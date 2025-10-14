import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortfolioItemForm from '@/components/admin/PortfolioItemForm'

export default async function EditPortfolioItemPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Edit Portfolio Item</h1>
          <p className="text-gray-600">Update your portfolio piece</p>
        </div>

        <PortfolioItemForm item={item} />
      </div>
    </div>
  )
}
