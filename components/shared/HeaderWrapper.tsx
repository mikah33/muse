'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Header from './Header'

interface CustomPage {
  id: string
  title: string
  slug: string
  show_in_header: boolean
  show_in_mobile_menu: boolean
  order_position: number
}

export default function HeaderWrapper() {
  const [customPages, setCustomPages] = useState<CustomPage[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchCustomPages() {
      const { data } = await supabase
        .from('custom_pages')
        .select('id, title, slug, show_in_header, show_in_mobile_menu, order_position')
        .eq('published', true)
        .order('order_position')

      if (data) {
        setCustomPages(data)
      }
    }

    fetchCustomPages()
  }, [])

  return <Header customPages={customPages} />
}
