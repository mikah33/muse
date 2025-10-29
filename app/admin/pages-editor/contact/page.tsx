'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ContactContent {
  hero: {
    title: string
    subtitle: string
  }
  contactInfo: {
    email: string
    phone: string
    hours: {
      weekday: string
      saturday: string
      sunday: string
    }
  }
}

export default function ContactPageEditor() {
  const [content, setContent] = useState<ContactContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/pages/contact')
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
      const response = await fetch('/api/admin/pages/contact', {
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
          <h1 className="text-3xl font-bold mb-2">Contact Page Editor</h1>
          <p className="text-gray-600">Edit hero and contact information</p>
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
              <textarea
                value={content.hero.subtitle}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value }
                })}
                rows={2}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={content.contactInfo.email}
                onChange={(e) => setContent({
                  ...content,
                  contactInfo: { ...content.contactInfo, email: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={content.contactInfo.phone}
                onChange={(e) => setContent({
                  ...content,
                  contactInfo: { ...content.contactInfo, phone: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Studio Hours</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Weekday Hours</label>
                  <input
                    type="text"
                    value={content.contactInfo.hours.weekday}
                    onChange={(e) => setContent({
                      ...content,
                      contactInfo: {
                        ...content.contactInfo,
                        hours: { ...content.contactInfo.hours, weekday: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                    placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Saturday Hours</label>
                  <input
                    type="text"
                    value={content.contactInfo.hours.saturday}
                    onChange={(e) => setContent({
                      ...content,
                      contactInfo: {
                        ...content.contactInfo,
                        hours: { ...content.contactInfo.hours, saturday: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                    placeholder="Saturday: 10:00 AM - 4:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sunday Hours</label>
                  <input
                    type="text"
                    value={content.contactInfo.hours.sunday}
                    onChange={(e) => setContent({
                      ...content,
                      contactInfo: {
                        ...content.contactInfo,
                        hours: { ...content.contactInfo.hours, sunday: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                    placeholder="Sunday: By Appointment Only"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
