// app/rsvp/[token]/_components/RSVPForm.jsx
"use client"

import { useState } from "react"
import { submitRSVP } from "@/lib/actions/rsvp"
import { Check, X, Utensils } from "lucide-react"

const dietaryOptions = [
  { value: "none", label: "No dietary requirements" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "gluten_free", label: "Gluten free" },
  { value: "other", label: "Other" },
]

export default function RSVPForm({
  guestId,
  token,
  currentRsvp,
  currentDietary,
  currentNotes,
  isCheckedIn,
}) {
  const [rsvp, setRsvp] = useState(currentRsvp || "pending")
  const [dietary, setDietary] = useState(currentDietary || "none")
  const [notes, setNotes] = useState(currentNotes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    if (rsvp === "pending") {
      setError("Please select whether you are attending or not")
      return
    }

    setIsSubmitting(true)
    setError("")

    const result = await submitRSVP({
      guestId,
      rsvpStatus: rsvp,
      dietaryNeeds: dietary,
      dietaryNotes: notes,
    })

    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    setSubmitted(true)
    setIsSubmitting(false)
  }

  // already checked in
  if (isCheckedIn) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check size={24} className="text-green-600" />
        </div>
        <h2 className="font-serif text-lg text-green-800 font-semibold mb-1">
          You are checked in
        </h2>
        <p className="text-sm text-green-600">
          Welcome to the event. Enjoy your time.
        </p>
      </div>
    )
  }

  // submitted successfully
  if (submitted) {
    return (
      <div className={`border rounded-xl p-6 text-center ${
        rsvp === "attending"
          ? "bg-green-50 border-green-200"
          : "bg-gray-50 border-gray-200"
      }`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
          rsvp === "attending" ? "bg-green-100" : "bg-gray-100"
        }`}>
          {rsvp === "attending"
            ? <Check size={24} className="text-green-600" />
            : <X size={24} className="text-gray-500" />
          }
        </div>
        <h2 className={`font-serif text-lg font-semibold mb-1 ${
          rsvp === "attending" ? "text-green-800" : "text-gray-700"
        }`}>
          {rsvp === "attending" ? "See you there!" : "Maybe next time"}
        </h2>
        <p className={`text-sm ${
          rsvp === "attending" ? "text-green-600" : "text-gray-500"
        }`}>
          {rsvp === "attending"
            ? "Your RSVP has been confirmed. We look forward to seeing you."
            : "Your response has been recorded. Thank you for letting us know."
          }
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* RSVP buttons */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-serif text-lg text-[#001B3C] font-semibold mb-5">
          Will you be attending?
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRsvp("attending")}
            className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 ${
              rsvp === "attending"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              rsvp === "attending" ? "bg-green-500" : "bg-gray-100"
            }`}>
              <Check size={20} className={rsvp === "attending" ? "text-white" : "text-gray-400"} />
            </div>
            <span className={`text-sm font-semibold ${
              rsvp === "attending" ? "text-green-700" : "text-gray-600"
            }`}>
              Yes, attending
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRsvp("not_attending")}
            className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 ${
              rsvp === "not_attending"
                ? "border-red-400 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              rsvp === "not_attending" ? "bg-red-400" : "bg-gray-100"
            }`}>
              <X size={20} className={rsvp === "not_attending" ? "text-white" : "text-gray-400"} />
            </div>
            <span className={`text-sm font-semibold ${
              rsvp === "not_attending" ? "text-red-600" : "text-gray-600"
            }`}>
              Cannot attend
            </span>
          </button>
        </div>
      </div>

      {/* dietary preferences — only show if attending */}
      {rsvp === "attending" && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Utensils size={16} className="text-[#1F477B]" />
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold">
              Dietary requirements
            </h2>
          </div>

          <div className="space-y-2 mb-4">
            {dietaryOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  dietary === option.value
                    ? "bg-[#001B3C]/5 border border-[#001B3C]/20"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="dietary"
                  value={option.value}
                  checked={dietary === option.value}
                  onChange={(e) => setDietary(e.target.value)}
                  className="accent-[#001B3C]"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          {/* notes field — show if other selected */}
          {dietary === "other" && (
            <div className="mt-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                Please specify
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your dietary requirements..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all resize-none"
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || rsvp === "pending"}
        className="w-full bg-[#001B3C] text-white py-4 rounded-xl text-sm font-semibold hover:bg-[#1F477B] transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Confirm my RSVP"}
      </button>

    </form>
  )
}