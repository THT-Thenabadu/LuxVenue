// app/venues/[id]/book/_components/BookingFlow.jsx
"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import EventDetailsStep from "./EventDetailsStep"
import PackageBuilderStep from "./PackageBuilderStep"
import ReviewStep from "./ReviewStep"
import { createBooking } from "@/lib/actions/booking"

const steps = [
  { number: 1, label: "Event details" },
  { number: 2, label: "Packages" },
  { number: 3, label: "Review" },
]

export default function BookingFlow({ venue, packages, userId }) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingData, setBookingData] = useState({
    eventName: "",
    eventType: "",
    startDate: "",
    endDate: "",
    guestCount: "",
    specialRequests: "",
    selectedPackages: [],
  })

  function handleDetailsSubmit(details) {
    setBookingData(prev => ({ ...prev, ...details }))
    setStep(2)
  }

  function handlePackagesSubmit(selectedPackages) {
    setBookingData(prev => ({ ...prev, selectedPackages }))
    setStep(3)
  }

  async function handleConfirm() {
    setIsSubmitting(true)
    const result = await createBooking(bookingData, venue.id, userId)
    if (result?.error) {
      alert(result.error)
      setIsSubmitting(false)
      return
    }
    // redirect happens inside the server action
  }

  // calculate total price
  const packageTotal = bookingData.selectedPackages.reduce(
    (sum, pkg) => sum + pkg.price * (pkg.quantity || 1), 0
  )
  const totalPrice = venue.price_per_day + packageTotal

  return (
    <div className="min-h-screen bg-[#F7F9FB] px-6 md:px-12 lg:px-20 py-10">

      {/* progress bar */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center flex-1">

              {/* step circle */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step > s.number
                    ? "bg-green-500 text-white"
                    : step === s.number
                    ? "bg-[#001B3C] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {step > s.number ? <Check size={16} /> : s.number}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  step >= s.number ? "text-[#001B3C]" : "text-gray-400"
                }`}>
                  {s.label}
                </span>
              </div>

              {/* connector line */}
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 mb-5 transition-all duration-300 ${
                  step > s.number ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}

            </div>
          ))}
        </div>
      </div>

      {/* venue summary card */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4">
          <img
            src={venue.images?.[0] || "https://placehold.co/100x100/001B3C/white?text=V"}
            alt={venue.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold">
              {venue.name}
            </h2>
            <p className="text-sm text-gray-500">{venue.location}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Base price</p>
            <p className="font-semibold text-[#001B3C]">
              LKR {venue.price_per_day?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* step content */}
      <div className="max-w-3xl mx-auto">
        {step === 1 && (
          <EventDetailsStep
            venue={venue}
            initialData={bookingData}
            onSubmit={handleDetailsSubmit}
          />
        )}
        {step === 2 && (
          <PackageBuilderStep
            packages={packages}
            initialSelected={bookingData.selectedPackages}
            onSubmit={handlePackagesSubmit}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <ReviewStep
            bookingData={bookingData}
            venue={venue}
            totalPrice={totalPrice}
            onConfirm={handleConfirm}
            onBack={() => setStep(2)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

    </div>
  )
}