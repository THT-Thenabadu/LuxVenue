// app/(dashboard)/dashboard/events/[id]/_components/RunOfShowTab.jsx
"use client"

import { useState } from "react"
import { Plus, Clock, Trash2, GripVertical, User } from "lucide-react"
import { addRunOfShowItem, deleteRunOfShowItem } from "@/lib/actions/events"

export default function RunOfShowTab({ eventId, initialItems }) {
  const [items, setItems] = useState(initialItems)
  const [showAdd, setShowAdd] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({
    time: "",
    title: "",
    description: "",
    responsible: "",
  })

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.time || !form.title) return
    setIsAdding(true)

    const result = await addRunOfShowItem(eventId, {
      ...form,
      order_index: items.length,
    })

    if (result?.item) {
      setItems(prev => [...prev, result.item])
      setForm({ time: "", title: "", description: "", responsible: "" })
      setShowAdd(false)
    }

    setIsAdding(false)
  }

  async function handleDelete(itemId) {
    // optimistic update
    setItems(prev => prev.filter(i => i.id !== itemId))
    await deleteRunOfShowItem(itemId)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-lg text-[#001B3C] font-semibold">
            Run of show
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Build your minute by minute event timeline
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-sm bg-[#001B3C] text-white px-4 py-2 rounded-lg hover:bg-[#1F477B] transition-colors"
        >
          <Plus size={14} /> Add item
        </button>
      </div>

      {/* add form */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-[#F7F9FB] rounded-xl p-5 mb-6 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm(p => ({ ...p, time: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Responsible
              </label>
              <input
                type="text"
                value={form.responsible}
                onChange={(e) => setForm(p => ({ ...p, responsible: e.target.value }))}
                placeholder="e.g. Coordinator, AV team"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Guests arrive, Dinner served, Speeches begin"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Notes <span className="text-gray-400 normal-case">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Any additional details..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isAdding}
              className="bg-[#001B3C] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1F477B] transition-colors disabled:opacity-70"
            >
              {isAdding ? "Adding..." : "Add item"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="border border-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* timeline */}
      {items.length === 0 ? (
        <div className="text-center py-10">
          <Clock size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-1">No items yet</p>
          <p className="text-xs text-gray-400">
            Add your first timeline item to get started
          </p>
        </div>
      ) : (
        <div className="relative">

          {/* vertical line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gray-100" />

          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={item.id} className="flex gap-4 group">

                {/* time dot */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-14 text-right">
                    <span className="text-xs font-semibold text-[#1F477B]">
                      {item.time?.slice(0, 5)}
                    </span>
                  </div>
                </div>

                {/* dot on timeline */}
                <div className="flex flex-col items-center flex-shrink-0 relative">
                  <div className="w-3 h-3 rounded-full bg-[#001B3C] border-2 border-white ring-2 ring-[#001B3C]/20 mt-1 z-10" />
                </div>

                {/* content */}
                <div className="flex-1 pb-6">
                  <div className="bg-[#F7F9FB] rounded-xl p-4 group-hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#001B3C] mb-1">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 leading-relaxed mb-2">
                            {item.description}
                          </p>
                        )}
                        {item.responsible && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <User size={11} />
                            {item.responsible}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}