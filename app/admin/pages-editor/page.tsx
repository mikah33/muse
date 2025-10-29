'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PagesEditorIndex() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Page Content Editor</h1>
        <p className="text-gray-600">Edit text content for different pages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/pages-editor/about"
          className="p-8 bg-white border-2 border-gray-200 hover:border-black transition-colors rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-2">About Page</h2>
          <p className="text-gray-600">Edit hero, introduction, and reasons sections</p>
        </Link>

        <Link
          href="/admin/pages-editor/services"
          className="p-8 bg-white border-2 border-gray-200 hover:border-black transition-colors rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-2">Services Page</h2>
          <p className="text-gray-600">Edit hero and introduction text</p>
        </Link>

        <Link
          href="/admin/pages-editor/portfolio"
          className="p-8 bg-white border-2 border-gray-200 hover:border-black transition-colors rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-2">Portfolio Page</h2>
          <p className="text-gray-600">Edit hero section text</p>
        </Link>

        <Link
          href="/admin/pages-editor/contact"
          className="p-8 bg-white border-2 border-gray-200 hover:border-black transition-colors rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-2">Contact Page</h2>
          <p className="text-gray-600">Edit hero and contact information</p>
        </Link>
      </div>
    </div>
  )
}
