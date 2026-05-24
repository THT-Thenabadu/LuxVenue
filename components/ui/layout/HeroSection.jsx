"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, Users, Sparkles, MoveRight } from "lucide-react"

export default function HeroSection() {
  const router = useRouter()

  const [date, setDate] = useState("")
  const [eventType, setEventType] = useState("")
  const [guestCount, setGuestCount] = useState("")

  const eventTypes = [
    "Wedding",
    "Corporate event",
    "Birthday / private party",
    "Gala / formal dinner",
    "Conference",
    "Other"
  ]

  function handleSearch() {
    const params = new URLSearchParams()
    if (date) params.set("date", date)
    if (eventType) params.set("type", eventType)
    if (guestCount) params.set("guests", guestCount)
    router.push(`/venues?${params.toString()}`)
  }

  return (
    <div className="relative">

      {/* background image */}
      <img
        className="w-full h-[100vh] object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs0TZwlcVaA5s-qF4w-NBQYl5BclQlS0oxxxSrDunc4bq_q8AiwTs4DklYK8ton22DHXECTOZqescgcI8YWk27d8FZoVekG78C8jSWTZCYtDRpV_puJ9ELSDO4wneSA_MOaCEj-8Sv2ZKay6DOHhG7eBld-JENmdUR5PJ3Kvv6HBggqEpYzcUwW5OgceoPGTKbkdz4RXv7Z6asNTjzNPvwD-qMcKUb6Q0EMZpyju7vKKgHEMHMC6_XC3NKJtP2sCGcDWqxiCfnOSQ"
        alt="hero venue"
      />

      {/* overlay content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">

        {/* frosted glass card */}
        <div className="backdrop-blur-lg bg-white/15 rounded-xl p-6 md:p-8 w-full max-w-xs md:max-w-md lg:max-w-xl">
          <h1 className="font-serif text-white text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            Architectural Precision in Every Reservation
          </h1>
          <button className="font-serif flex items-center gap-x-2 bg-[#001B3C] text-white px-5 py-2 rounded-xl shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0">
            Plan your event <MoveRight size={18} />
          </button>
        </div>

        {/* search bar — stacks vertically on mobile, row on desktop */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-4 w-full max-w-xs md:max-w-2xl lg:max-w-4xl flex flex-col md:flex-row gap-4 items-stretch md:items-center">

          {/* date */}
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide flex items-center gap-1">
              <Calendar size={13} /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm text-gray-700 outline-none w-full"
            />
          </div>

          <div className="hidden md:block w-px bg-gray-200 self-stretch" />

          {/* event type */}
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide flex items-center gap-1">
              <Sparkles size={13} /> Event type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="text-sm text-gray-700 outline-none w-full bg-transparent"
            >
              <option value="">Select type</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:block w-px bg-gray-200 self-stretch" />

          {/* guest count */}
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide flex items-center gap-1">
              <Users size={13} /> Guests
            </label>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="Number of guests"
              min="1"
              max="1000"
              className="text-sm text-gray-700 outline-none w-full"
            />
          </div>

          {/* search button */}
          <button
              suppressHydrationWarning
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-[#001B3C] text-white px-6 py-3 rounded-lg shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out whitespace-nowrap"
            >
              <Search size={16} /> Search
            </button>

        </div>

      </div>

    </div>
  )
}