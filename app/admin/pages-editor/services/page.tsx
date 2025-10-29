'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ServicesContent {
  hero: {
    title: string
    subtitle: string
  }
  introduction: {
    paragraph1: string
    paragraph2: string
  }
}

export default function ServicesPageEditor() {
  const [content, setContent] = useState<ServicesContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/pages/services')
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    try {
      const response = await fetch('/api/admin/pages/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })
      if (response.ok) {
        alert('Content saved successfully!')
      } else {
        alert('Failed to save content')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!content) return <div className="p-8">Failed to load content</div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin/pages-editor" className="text-gray-600 hover:text-black">
              ← Back to Pages
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Services Page Editor</h1>
          <p className="text-gray-600">Edit hero and introduction text</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Hero Section</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <input
                type="text"
                value={content.hero.subtitle}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Introduction Section</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Paragraph</label>
              <textarea
                value={content.introduction.paragraph1}
                onChange={(e) => setContent({
                  ...content,
                  introduction: { ...content.introduction, paragraph1: e.target.value }
                })}
                rows={4}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Second Paragraph</label>
              <textarea
                value={content.introduction.paragraph2}
                onChange={(e) => setContent({
                  ...content,
                  introduction: { ...content.introduction, paragraph2: e.target.value }
                })}
                rows={4}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
