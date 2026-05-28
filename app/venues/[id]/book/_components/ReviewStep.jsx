// app/venues/[id]/book/_components/ReviewStep.jsx
"use client"

import { MapPin, Calendar, Users, Package } from "lucide-react"

export default function ReviewStep({ bookingData, venue, totalPrice, onConfirm, onBack, isSubmitting }) {

  const depositAmount = totalPrice * 0.3

  return (
    <div className="space-y-6">

      <div className="bg-white border border-gray-100 rounded-xl p-8">
        <h2 className="font-serif text-2xl text-[#001B3C] font-semibold mb-2">
          Review your booking
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Please review everything before confirming.
        </p>

        {/* event details */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Event details
          </h3>
          <div className="bg-[#F7F9FB] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-[#1F477B] flex-shrink-0" />
              <span className="text-gray-500 w-28">Event name</span>
              <span className="font-medium text-[#001B3C]">{bookingData.eventName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Package size={15} className="text-[#1F477B] flex-shrink-0" />
              <span className="text-gray-500 w-28">Event type</span>
              <span className="font-medium text-[#001B3C]">{bookingData.eventType}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-[#1F477B] flex-shrink-0" />
              <span className="text-gray-500 w-28">Dates</span>
              <span className="font-medium text-[#001B3C]">
                {bookingData.startDate} → {bookingData.endDate}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users size={15} className="text-[#1F477B] flex-shrink-0" />
              <span className="text-gray-500 w-28">Guests</span>
              <span className="font-medium text-[#001B3C]">{bookingData.guestCount}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={15} className="text-[#1F477B] flex-shrink-0" />
              <span className="text-gray-500 w-28">Venue</span>
              <span className="font-medium text-[#001B3C]">{venue.name}</span>
            </div>
          </div>
        </div>

        {/* price breakdown */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Price breakdown
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Venue — {venue.name}</span>
              <span className="text-[#001B3C]">LKR {venue.price_per_day?.toLocaleString()}</span>
            </div>
            {bookingData.selectedPackages.map(pkg => (
              <div key={pkg.id} className="flex justify-between text-sm">
                <span className="text-gray-500">{pkg.name}</span>
                <span className="text-[#001B3C]">LKR {pkg.price?.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-sm">
              <span className="text-[#001B3C]">Total</span>
              <span className="text-[#001B3C]">LKR {totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* deposit notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
          <p className="text-sm text-blue-800 font-semibold mb-1">
            Deposit required to confirm
          </p>
          <p className="text-xs text-blue-600 leading-relaxed">
            A 30% deposit of <strong>LKR {depositAmount?.toLocaleString()}</strong> is required
            to confirm your booking. The remaining balance will be due 30 days before your event.
          </p>
        </div>

        {/* special requests */}
        {bookingData.specialRequests && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Special requests
            </h3>
            <p className="text-sm text-gray-600 bg-[#F7F9FB] rounded-xl p-4">
              {bookingData.specialRequests}
            </p>
          </div>
        )}

        {/* terms notice */}
        <p className="text-xs text-gray-400 leading-relaxed mb-6">
          By confirming this booking you agree to our cancellation policy.
          Deposits are non-refundable within 30 days of the event date.
          A contract will be sent to your email for digital signature.
        </p>

        {/* navigation */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 border border-gray-200 text-gray-600 py-4 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 bg-[#001B3C] text-white py-4 rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Confirming..." : "Confirm booking →"}
          </button>
        </div>

      </div>
    </div>
  )
}