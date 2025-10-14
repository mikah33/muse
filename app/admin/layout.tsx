import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <AdminNav userEmail={user?.email} />
      {children}
    </>
  )
}
