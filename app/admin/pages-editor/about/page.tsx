'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AboutContent {
  hero: {
    title: string
    subtitle: string
  }
  introduction: {
    paragraph1: string
    paragraph2: string
    paragraph3: string
  }
  whyChoose: {
    title: string
    reason1: { title: string; description: string }
    reason2: { title: string; description: string }
    reason3: { title: string; description: string }
  }
}

export default function AboutPageEditor() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'hero' | 'introduction' | 'whyChoose'>('hero')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/pages/about')
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
      const response = await fetch('/api/admin/pages/about', {
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
          <h1 className="text-3xl font-bold mb-2">About Page Editor</h1>
          <p className="text-gray-600">Edit all text content on the About page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveSection('hero')}
          className={`px-4 py-2 font-medium ${activeSection === 'hero' ? 'border-b-2 border-black' : 'text-gray-500'}`}
        >
          Hero Section
        </button>
        <button
          onClick={() => setActiveSection('introduction')}
          className={`px-4 py-2 font-medium ${activeSection === 'introduction' ? 'border-b-2 border-black' : 'text-gray-500'}`}
        >
          Introduction
        </button>
        <button
          onClick={() => setActiveSection('whyChoose')}
          className={`px-4 py-2 font-medium ${activeSection === 'whyChoose' ? 'border-b-2 border-black' : 'text-gray-500'}`}
        >
          Why Choose Us
        </button>
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Hero Section</h2>

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
      )}

      {/* Introduction Section */}
      {activeSection === 'introduction' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Introduction Section</h2>

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

          <div>
            <label className="block text-sm font-medium mb-2">Third Paragraph</label>
            <textarea
              value={content.introduction.paragraph3}
              onChange={(e) => setContent({
                ...content,
                introduction: { ...content.introduction, paragraph3: e.target.value }
              })}
              rows={4}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      )}

      {/* Why Choose Section */}
      {activeSection === 'whyChoose' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Why Choose Us Section</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Section Title</label>
            <input
              type="text"
              value={content.whyChoose.title}
              onChange={(e) => setContent({
                ...content,
                whyChoose: { ...content.whyChoose, title: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Reason 1</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={content.whyChoose.reason1.title}
                  onChange={(e) => setContent({
                    ...content,
                    whyChoose: {
                      ...content.whyChoose,
                      reason1: { ...content.whyChoose.reason1, title: e.target.value }
                    }
                  })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={content.whyChoose.reason1.description}
                  onChange={(e) => setContent({
                    ...content,
                    whyChoose: {
                      ...content.whyChoose,
                      reason1: { ...content.whyChoose.reason1, description: e.target.value }
                    }
                  })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Reason 2</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={content.whyChoose.reason2.title}
                  onChange={(e) => setContent({
                    ...content,
                    whyChoose: {
                      ...content.whyChoose,
                      reason2: { ...content.whyChoose.reason2, title: e.target.value }
                    }
                  })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={content.whyChoose.reason2.description}
                  onChange={(e) => setContent({
                    ...content,
                    whyChoose: {
                      ...content.whyChoose,
                      reason2: { ...content.whyChoose.reason2, description: e.target.value }
                    }
                  })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Reason 3</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={content.whyChoose.reason3.title}
                  onChange={(e) => setContent({
                    ...content,
                    whyChoose: {
                      ...content.whyChoose,
                      reason3: { ...content.whyChoose.reason3, title: e.target.value }
                    }
                  })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={content.whyChoose.reason3.description}
                  onChange={(e) => setContent({
                    ...content,
                    whyChoose: {
                      ...content.whyChoose,
                      reason3: { ...content.whyChoose.reason3, description: e.target.value }
                    }
                  })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
