// app/(dashboard)/dashboard/events/[id]/_components/ChecklistTab.jsx
"use client"

import { useState } from "react"
import { toggleChecklistItem, addChecklistItem } from "@/lib/actions/events"
import { Check, Plus, Calendar } from "lucide-react"

export default function ChecklistTab({ eventId, checklist }) {
  const [items, setItems] = useState(checklist)
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDueDate, setNewDueDate] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  async function handleToggle(itemId, currentState) {
    // optimistic update — update UI immediately before server confirms
    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, is_completed: !currentState }
          : item
      )
    )
    await toggleChecklistItem(itemId, !currentState)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setIsAdding(true)
    const result = await addChecklistItem(eventId, newTitle, newDueDate)
    console.log("Result:", result)        // ← add this
  console.log("Result item:", result?.item)
    if (result?.item) {
      setItems(prev => [...prev, result.item])
      setNewTitle("")
      setNewDueDate("")
      setShowAdd(false)
    }
    setIsAdding(false)
  }

  const completed = items.filter(i => i.is_completed).length
  const total = items.length

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-lg text-[#001B3C] font-semibold">
            Pre-event checklist
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {completed} of {total} tasks completed
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-sm bg-[#001B3C] text-white px-4 py-2 rounded-lg hover:bg-[#1F477B] transition-colors"
        >
          <Plus size={14} /> Add task
        </button>
      </div>

      {/* add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-[#F7F9FB] rounded-xl p-4 mb-4 flex flex-col gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title e.g. Submit guest list"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
          />
          <div className="flex gap-3">
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
            />
            <button
              type="submit"
              disabled={isAdding}
              className="bg-[#001B3C] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1F477B] transition-colors disabled:opacity-70"
            >
              {isAdding ? "Adding..." : "Add"}
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

      {/* checklist items */}
      {items.length === 0 ? (
        <div className="text-center py-10">
          <Check size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No tasks yet. Add your first task above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                item.is_completed ? "bg-gray-50" : "bg-[#F7F9FB]"
              }`}
            >
              <button
                onClick={() => handleToggle(item.id, item.is_completed)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  item.is_completed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 hover:border-[#001B3C]"
                }`}
              >
                {item.is_completed && <Check size={12} className="text-white" />}
              </button>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  item.is_completed ? "line-through text-gray-400" : "text-[#001B3C]"
                }`}>
                  {item.title}
                </p>
                {item.due_date && (
                  <p className={`text-xs mt-0.5 flex items-center gap-1 ${
                    item.is_completed
                      ? "text-gray-400"
                      : new Date(item.due_date) < new Date()
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}>
                    <Calendar size={11} />
                    Due {new Date(item.due_date).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                    {!item.is_completed && new Date(item.due_date) < new Date() && " — Overdue"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}