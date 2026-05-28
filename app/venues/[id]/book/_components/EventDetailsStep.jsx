// app/venues/[id]/book/_components/EventDetailsStep.jsx
"use client"

import { useState } from "react"

const eventTypes = [
  "Wedding",
  "Corporate event",
  "Birthday / private party",
  "Gala / formal dinner",
  "Conference",
  "Other"
]

export default function EventDetailsStep({ venue, initialData, onSubmit }) {
  const [form, setForm] = useState({
    eventName: initialData.eventName || "",
    eventType: initialData.eventType || "",
    startDate: initialData.startDate || "",
    endDate: initialData.endDate || "",
    guestCount: initialData.guestCount || "",
    specialRequests: initialData.specialRequests || "",
  })
  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}
    if (!form.eventName) newErrors.eventName = "Event name is required"
    if (!form.eventType) newErrors.eventType = "Please select an event type"
    if (!form.startDate) newErrors.startDate = "Start date is required"
    if (!form.endDate) newErrors.endDate = "End date is required"
    if (!form.guestCount) newErrors.guestCount = "Guest count is required"
    if (form.guestCount > venue.capacity) {
      newErrors.guestCount = `Maximum capacity is ${venue.capacity} guests`
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      newErrors.endDate = "End date cannot be before start date"
    }
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(form)
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-8">
      <h2 className="font-serif text-2xl text-[#001B3C] font-semibold mb-2">
        Event details
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Tell us about your event so we can prepare everything perfectly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* event name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Event name
          </label>
          <input
            type="text"
            value={form.eventName}
            onChange={(e) => handleChange("eventName", e.target.value)}
            placeholder="e.g. The Johnson Wedding"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
          />
          {errors.eventName && (
            <p className="text-xs text-red-500">{errors.eventName}</p>
          )}
        </div>

        {/* event type */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Event type
          </label>
          <select
            value={form.eventType}
            onChange={(e) => handleChange("eventType", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] bg-white transition-all"
          >
            <option value="">Select event type</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.eventType && (
            <p className="text-xs text-red-500">{errors.eventType}</p>
          )}
        </div>

        {/* dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Start date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] transition-all"
            />
            {errors.startDate && (
              <p className="text-xs text-red-500">{errors.startDate}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              End date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              min={form.startDate || new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] transition-all"
            />
            {errors.endDate && (
              <p className="text-xs text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* guest count */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Number of guests
          </label>
          <input
            type="number"
            value={form.guestCount}
            onChange={(e) => handleChange("guestCount", e.target.value)}
            placeholder={`Max ${venue.capacity}`}
            min="1"
            max={venue.capacity}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] transition-all"
          />
          {errors.guestCount && (
            <p className="text-xs text-red-500">{errors.guestCount}</p>
          )}
        </div>

        {/* special requests */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Special requests <span className="text-gray-400 normal-case">(optional)</span>
          </label>
          <textarea
            value={form.specialRequests}
            onChange={(e) => handleChange("specialRequests", e.target.value)}
            placeholder="Any special requirements or requests..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#001B3C] text-white py-4 rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-colors"
        >
          Continue to packages →
        </button>

      </form>
    </div>
  )
}