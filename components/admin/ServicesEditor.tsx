'use client'

import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Save, X, Plus, Trash2 } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  order_position: number
  is_active: boolean
  items: string[]
}

function SortableService({
  service,
  onSave
}: {
  service: Service
  onSave: (service: Service) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: service.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [isEditing, setIsEditing] = useState(false)
  const [editedService, setEditedService] = useState(service)

  const handleSave = async () => {
    await onSave(editedService)
    setIsEditing(false)
  }

  const addItem = () => {
    setEditedService({
      ...editedService,
      items: [...(editedService.items || []), '']
    })
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...(editedService.items || [])]
    newItems[index] = value
    setEditedService({ ...editedService, items: newItems })
  }

  const removeItem = (index: number) => {
    setEditedService({
      ...editedService,
      items: (editedService.items || []).filter((_, i) => i !== index)
    })
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-lg mb-4">
      <div className="p-6">
        <div className="flex items-start gap-4">
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
                <div className="mb-2">
                  <h3 className="font-serif text-2xl">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
                >
                  EDIT
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={editedService.title}
                    onChange={(e) => setEditedService({ ...editedService, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (Short summary)</label>
                  <textarea
                    value={editedService.description}
                    onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Detailed Content (shown in popup)</label>
                    <button
                      onClick={addItem}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(editedService.items || []).map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <textarea
                          value={item}
                          onChange={(e) => updateItem(index, e.target.value)}
                          rows={3}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                          placeholder="Detailed service information..."
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
                      setEditedService(service)
                      setIsEditing(false)
                    }}
                    className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-sm tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      if (data.services) {
        setServices(data.services)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        // Save new order to backend
        fetch('/api/admin/services', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ services: newItems })
        })

        return newItems
      })
    }
  }

  const handleSaveService = async (service: Service) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      })

      if (res.ok) {
        const data = await res.json()
        setServices(services.map(s => s.id === service.id ? data.service : s))
        alert('Service updated successfully!')
      }
    } catch (error) {
      console.error('Failed to save service:', error)
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
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2">Services Editor</h1>
        <p className="text-gray-600">Edit the 5 service cards displayed on the homepage. Drag to reorder.</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={services.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {services.map((service) => (
            <SortableService
              key={service.id}
              service={service}
              onSave={handleSaveService}
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
