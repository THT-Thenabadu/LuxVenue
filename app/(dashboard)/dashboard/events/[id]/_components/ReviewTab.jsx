// app/(dashboard)/dashboard/events/[id]/_components/ReviewTab.jsx
"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { submitReview } from "@/lib/actions/events"

export default function ReviewTab({ eventId, userId, existingReview, eventStatus }) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState(existingReview?.comment || "")
  const [isAnonymous, setIsAnonymous] = useState(existingReview?.is_anonymous || false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(!!existingReview)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating === 0) {
      setError("Please select a star rating")
      return
    }

    setIsSubmitting(true)
    setError("")

    const result = await submitReview({
      eventId,
      rating,
      comment,
      isAnonymous,
    })

    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    setSubmitted(true)
    setIsSubmitting(false)
  }

  // event not completed yet
  if (eventStatus !== "completed") {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="text-center py-10">
          <Star size={32} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-gray-400 font-semibold mb-2">
            Review not available yet
          </h3>
          <p className="text-sm text-gray-400">
            You can leave a review once your event is marked as completed.
          </p>
        </div>
      </div>
    )
  }

  // already reviewed
  if (submitted) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="text-center py-10">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={star <= rating ? "fill-[#001B3C] text-[#001B3C]" : "text-gray-200"}
              />
            ))}
          </div>
          <h3 className="font-serif text-lg text-[#001B3C] font-semibold mb-2">
            Thank you for your review
          </h3>
          {comment && (
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              "{comment}"
            </p>
          )}
          {isAnonymous && (
            <p className="text-xs text-gray-400 mt-3">Submitted anonymously</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">

      <h3 className="font-serif text-lg text-[#001B3C] font-semibold mb-2">
        Leave a review
      </h3>
      <p className="text-sm text-gray-500 mb-8">
        How was your experience with LuxVenue? Your feedback helps us improve.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* star rating */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={36}
                  className={`transition-colors ${
                    star <= (hovered || rating)
                      ? "fill-[#001B3C] text-[#001B3C]"
                      : "text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-gray-400">
              {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
            </p>
          )}
        </div>

        {/* comment */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Comment <span className="text-gray-400 normal-case">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience — the venue, the coordination, the day itself..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all resize-none"
          />
        </div>

        {/* anonymous toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-[#001B3C]"
          />
          <span className="text-sm text-gray-500">
            Submit anonymously — your name will not be shown publicly
          </span>
        </label>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-[#001B3C] text-white py-4 rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit review"}
        </button>

      </form>
    </div>
  )
}