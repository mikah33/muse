'use client'

import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Save, X, Plus, Trash2 } from 'lucide-react'

interface HomepageSection {
  id: string
  section_number: string
  icon: string
  title: string
  description: string
  items: string[]
  display_order: number
}

function SortableSection({
  section,
  onEdit,
  onSave
}: {
  section: HomepageSection
  onEdit: (section: HomepageSection) => void
  onSave: (section: HomepageSection) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [isEditing, setIsEditing] = useState(false)
  const [editedSection, setEditedSection] = useState(section)

  const handleSave = async () => {
    await onSave(editedSection)
    setIsEditing(false)
  }

  const addItem = () => {
    setEditedSection({
      ...editedSection,
      items: [...editedSection.items, '']
    })
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...editedSection.items]
    newItems[index] = value
    setEditedSection({ ...editedSection, items: newItems })
  }

  const removeItem = (index: number) => {
    setEditedSection({
      ...editedSection,
      items: editedSection.items.filter((_, i) => i !== index)
    })
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-lg mb-4">
      <div className="p-6">
        {/* Header with drag handle */}
        <div className="flex items-start gap-4 mb-4">
          <button
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </button>

          <div className="flex-1">
            {!isEditing ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{section.icon}</span>
                  <h3 className="font-serif text-2xl">{section.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <div className="space-y-2">
                  {section.items.map((item, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4 text-sm text-gray-700">
                      {item.substring(0, 100)}...
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-4 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
                >
                  EDIT
                </button>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
                    <input
                      type="text"
                      value={editedSection.icon}
                      onChange={(e) => setEditedSection({ ...editedSection, icon: e.target.value })}
                      className="w-20 px-3 py-2 border border-gray-300 rounded text-2xl"
                      placeholder="📸"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={editedSection.title}
                      onChange={(e) => setEditedSection({ ...editedSection, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={editedSection.description}
                      onChange={(e) => setEditedSection({ ...editedSection, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Service Items</label>
                      <button
                        onClick={addItem}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </button>
                    </div>
                    <div className="space-y-3">
                      {editedSection.items.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <textarea
                            value={item}
                            onChange={(e) => updateItem(index, e.target.value)}
                            rows={3}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                            placeholder="Service item description..."
                          />
                          <button
                            onClick={() => removeItem(index)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      SAVE CHANGES
                    </button>
                    <button
                      onClick={() => {
                        setEditedSection(section)
                        setIsEditing(false)
                      }}
                      className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-sm tracking-wider hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      CANCEL
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomepageEditor() {
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/homepage')
      const data = await res.json()
      if (data.sections) {
        setSections(data.sections)
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        // Save new order to backend
        fetch('/api/admin/homepage', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sections: newItems })
        })

        return newItems
      })
    }
  }

  const handleSaveSection = async (section: HomepageSection) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section)
      })

      if (res.ok) {
        const data = await res.json()
        setSections(sections.map(s => s.id === section.id ? data.section : s))
      }
    } catch (error) {
      console.error('Failed to save section:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homepage sections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2">Homepage Editor</h1>
        <p className="text-gray-600">Edit the 5 service categories displayed on the homepage. Drag to reorder.</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onEdit={(s) => console.log('Edit', s)}
              onSave={handleSaveSection}
            />
          ))}
        </SortableContext>
      </DndContext>

      {saving && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-6 py-3 rounded shadow-lg">
          Saving changes...
        </div>
      )}
    </div>
  )
}
