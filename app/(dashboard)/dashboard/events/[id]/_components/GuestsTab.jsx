// app/(dashboard)/dashboard/events/[id]/_components/GuestsTab.jsx
"use client"

import { useState } from "react"
import { addGuest } from "@/lib/actions/events"
import { UserPlus, Mail, Phone, Check, Clock, X } from "lucide-react"

const rsvpColors = {
  pending: "bg-yellow-100 text-yellow-700",
  attending: "bg-green-100 text-green-700",
  not_attending: "bg-red-100 text-red-600",
}

export default function GuestsTab({ eventId, guests }) {
  const [guestList, setGuestList] = useState(guests)
  const [showAdd, setShowAdd] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", phone: "", dietary_needs: "none"
  })

  async function handleAdd(e) {
    e.preventDefault()
    setIsAdding(true)
    const result = await addGuest(eventId, form)
    if (result?.guest) {
      setGuestList(prev => [result.guest, ...prev])
      setForm({ name: "", email: "", phone: "", dietary_needs: "none" })
      setShowAdd(false)
    }
    setIsAdding(false)
  }

  const attending = guestList.filter(g => g.rsvp_status === "attending").length
  const pending = guestList.filter(g => g.rsvp_status === "pending").length

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-lg text-[#001B3C] font-semibold">
            Guest list
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {guestList.length} total · {attending} attending · {pending} pending
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-sm bg-[#001B3C] text-white px-4 py-2 rounded-lg hover:bg-[#1F477B] transition-colors"
        >
          <UserPlus size={14} /> Add guest
        </button>
      </div>

      {/* add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-[#F7F9FB] rounded-xl p-5 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Full name"
              required
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="Email address"
              required
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="Phone (optional)"
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
            />
            <select
              value={form.dietary_needs}
              onChange={(e) => setForm(p => ({ ...p, dietary_needs: e.target.value }))}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all bg-white"
            >
              <option value="none">No dietary needs</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="halal">Halal</option>
              <option value="kosher">Kosher</option>
              <option value="gluten_free">Gluten free</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isAdding}
              className="bg-[#001B3C] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1F477B] transition-colors disabled:opacity-70"
            >
              {isAdding ? "Adding..." : "Add guest"}
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

      {/* guest list */}
      {guestList.length === 0 ? (
        <div className="text-center py-10">
          <UserPlus size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No guests added yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {guestList.map((guest) => (
            <div key={guest.id} className="flex items-center gap-4 p-4 bg-[#F7F9FB] rounded-xl">
              <div className="w-9 h-9 rounded-full bg-[#001B3C] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {guest.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#001B3C] truncate">
                  {guest.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400 flex items-center gap-1 truncate">
                    <Mail size={11} /> {guest.email}
                  </span>
                  {guest.dietary_needs && guest.dietary_needs !== "none" && (
                    <span className="text-xs text-gray-400 capitalize">
                      · {guest.dietary_needs.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${rsvpColors[guest.rsvp_status]}`}>
                {guest.rsvp_status === "not_attending" ? "Declined" : guest.rsvp_status}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}