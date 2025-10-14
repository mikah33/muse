'use client'

import { useState } from 'react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-lg shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 lg:p-10">
          <h2 className="font-serif text-3xl mb-2">Book Your Shoot</h2>
          <p className="text-gray-600 mb-6 text-sm font-light">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>

          {success ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xl font-serif mb-2">Message sent!</p>
              <p className="text-gray-600 text-sm font-light">We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-name" className="block text-xs tracking-wider mb-1 font-light">
                  NAME *
                </label>
                <input
                  type="text"
                  id="modal-name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="modal-email" className="block text-xs tracking-wider mb-1 font-light">
                  EMAIL *
                </label>
                <input
                  type="email"
                  id="modal-email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="modal-phone" className="block text-xs tracking-wider mb-1 font-light">
                  PHONE
                </label>
                <input
                  type="tel"
                  id="modal-phone"
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="modal-service" className="block text-xs tracking-wider mb-1 font-light">
                  INTERESTED IN
                </label>
                <select
                  id="modal-service"
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="">Select a service</option>
                  <option value="portfolio">Modeling Portfolio</option>
                  <option value="headshots">Actor Headshots</option>
                  <option value="fashion">Fashion Photography</option>
                  <option value="beauty">Beauty Photography</option>
                  <option value="editorial">Editorial Shoots</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-message" className="block text-xs tracking-wider mb-1 font-light">
                  MESSAGE *
                </label>
                <textarea
                  id="modal-message"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-black text-white tracking-widest text-xs hover:bg-gray-900 transition-colors disabled:bg-gray-400"
              >
                {submitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
