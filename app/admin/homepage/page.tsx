'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface HomepageContent {
  hero: {
    title: string
    subtitle: string
    tagline: string
    description: string
    primaryButton: string
    secondaryButton: string
  }
  about: {
    heading: string
    subheading: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
  }
  services_header: {
    title: string
    subtitle: string
    description: string
    subdescription: string
  }
}

export default function HomepageEditor() {
  const router = useRouter()
  const [content, setContent] = useState<HomepageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'services_header'>('hero')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/homepage-content')
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
      const response = await fetch('/api/admin/homepage-content', {
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

  const updateContent = (section: keyof HomepageContent, field: string, value: string) => {
    if (!content) return
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [field]: value
      }
    })
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!content || !content.hero || !content.about || !content.services_header) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Database Setup Required</h1>
          <p className="mb-6">The homepage content table needs to be initialized.</p>
          <button
            onClick={async () => {
              setLoading(true)
              try {
                const res = await fetch('/api/admin/migrate-homepage', { method: 'POST' })
                const data = await res.json()
                if (res.ok) {
                  alert('Setup complete! Refreshing...')
                  window.location.reload()
                } else {
                  alert('Setup failed: ' + (data.error || 'Unknown error'))
                  console.error('Setup error:', data)
                }
              } catch (error) {
                console.error('Setup error:', error)
                alert('Setup failed. Check console for errors.')
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="px-8 py-4 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 text-lg"
          >
            {loading ? 'Setting up...' : 'Initialize Homepage Editor'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Homepage Content Editor</h1>
          <p className="text-gray-600">Edit hero, about, and services header text</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/admin/services-editor"
            className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            Edit 5 Service Sections →
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
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
          onClick={() => setActiveSection('about')}
          className={`px-4 py-2 font-medium ${activeSection === 'about' ? 'border-b-2 border-black' : 'text-gray-500'}`}
        >
          About Section
        </button>
        <button
          onClick={() => setActiveSection('services_header')}
          className={`px-4 py-2 font-medium ${activeSection === 'services_header' ? 'border-b-2 border-black' : 'text-gray-500'}`}
        >
          Services Header
        </button>
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Hero Section</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Main Title</label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => updateContent('hero', 'title', e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={content.hero.subtitle}
              onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tagline (All Caps)</label>
            <input
              type="text"
              value={content.hero.tagline}
              onChange={(e) => updateContent('hero', 'tagline', e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={content.hero.description}
              onChange={(e) => updateContent('hero', 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Primary Button Text</label>
            <input
              type="text"
              value={content.hero.primaryButton}
              onChange={(e) => updateContent('hero', 'primaryButton', e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secondary Button Text</label>
            <input
              type="text"
              value={content.hero.secondaryButton}
              onChange={(e) => updateContent('hero', 'secondaryButton', e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">About Section</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Heading</label>
            <input
              type="text"
              value={content.about.heading}
              onChange={(e) => updateContent('about', 'heading', e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subheading (Italic)</label>
            <input
              type="text"
              value={content.about.subheading}
              onChange={(e) => updateContent('about', 'subheading', e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">First Paragraph</label>
            <textarea
              value={content.about.paragraph1}
              onChange={(e) => updateContent('about', 'paragraph1', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Second Paragraph</label>
            <textarea
              value={content.about.paragraph2}
              onChange={(e) => updateContent('about', 'paragraph2', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Third Paragraph</label>
            <textarea
              value={content.about.paragraph3}
              onChange={(e) => updateContent('about', 'paragraph3', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      )}

      {/* Services Header Section */}
      {activeSection === 'services_header' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Services Header Section</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={content.services_header.title}
              onChange={(e) => updateContent('services_header', 'title', e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={content.services_header.subtitle}
              onChange={(e) => updateContent('services_header', 'subtitle', e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={content.services_header.description}
              onChange={(e) => updateContent('services_header', 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subdescription</label>
            <textarea
              value={content.services_header.subdescription}
              onChange={(e) => updateContent('services_header', 'subdescription', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      )}
    </div>
  )
}
