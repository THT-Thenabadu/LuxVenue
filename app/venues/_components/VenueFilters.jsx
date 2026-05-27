// app/venues/_components/VenueFilters.jsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

const eventTypes = [
  "Wedding",
  "Corporate event",
  "Birthday / private party",
  "Gala / formal dinner",
  "Conference",
  "Other"
]

export default function VenueFilters({ currentType, currentGuests, currentDate }) {
  const router = useRouter()

  const [type, setType] = useState(currentType || "")
  const [guests, setGuests] = useState(currentGuests || "")
  const [date, setDate] = useState(currentDate || "")

  function applyFilters() {
    const params = new URLSearchParams()
    if (type) params.set("type", type)
    if (guests) params.set("guests", guests)
    if (date) params.set("date", date)
    router.push(`/venues?${params.toString()}`)
  }

  function clearFilters() {
    setType("")
    setGuests("")
    setDate("")
    router.push("/venues")
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col gap-5">

      <h3 className="font-semibold text-[#001B3C] text-sm">Filter venues</h3>

      {/* date */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Event date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#001B3C] transition-all"
        />
      </div>

      {/* event type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Event type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#001B3C] transition-all bg-white"
        >
          <option value="">All types</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* guest count */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Minimum guests
        </label>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="e.g. 100"
          min="1"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#001B3C] transition-all"
        />
      </div>

      {/* buttons */}
      <button
        onClick={applyFilters}
        className="w-full bg-[#001B3C] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#1F477B] transition-colors"
      >
        Apply filters
      </button>

      <button
        onClick={clearFilters}
        className="w-full border border-gray-200 text-gray-500 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Clear all
      </button>

    </div>
  )
}