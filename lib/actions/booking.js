// lib/actions/booking.js
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function createBooking(bookingData, venueId, userId) {
  const supabase = await createClient()

  const eventTypeMap = {
    "Wedding": "wedding",
    "Corporate event": "corporate",
    "Birthday / private party": "birthday",
    "Gala / formal dinner": "gala",
    "Conference": "conference",
    "Other": "other"
  }

  // insert the event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      venue_id: venueId,
      organiser_id: userId,
      name: bookingData.eventName,
      event_type: eventTypeMap[bookingData.eventType] || "other",
      status: "enquiry",
      start_date: bookingData.startDate,
      end_date: bookingData.endDate,
      guest_count: parseInt(bookingData.guestCount),
      special_requests: bookingData.specialRequests || null,
    })
    .select()
    .single()

  if (eventError) {
    console.error("Event insert error:", eventError)
    return { error: "Failed to create booking. Please try again." }
  }

  // insert selected packages
  if (bookingData.selectedPackages.length > 0) {
    const packageInserts = bookingData.selectedPackages.map(pkg => ({
      event_id: event.id,
      package_id: pkg.id,
      quantity: pkg.quantity || 1,
      price_at_booking: pkg.price,
    }))

    const { error: packagesError } = await supabase
      .from("event_packages")
      .insert(packageInserts)

    if (packagesError) {
      console.error("Packages insert error:", packagesError)
    }
  }

  // fetch venue price
  const { data: venue } = await supabase
    .from("venues")
    .select("price_per_day")
    .eq("id", venueId)
    .single()

  // calculate deposit amount (30%)
  const packageTotal = bookingData.selectedPackages.reduce(
    (sum, pkg) => sum + parseFloat(pkg.price), 0
  )
  const total = (parseFloat(venue?.price_per_day) || 0) + packageTotal
  const depositAmount = total * 0.3

  // create the deposit payment record
  const depositDueDate = new Date()
  depositDueDate.setDate(depositDueDate.getDate() + 7)

  const { data: paymentData, error: paymentError } = await supabase
    .from("payments")
    .insert({
      event_id: event.id,
      type: "deposit",
      amount: depositAmount,
      status: "pending",
      due_date: depositDueDate.toISOString().split("T")[0],
    })
    .select()

  console.log("Deposit amount:", depositAmount)
  console.log("Payment result:", paymentData)
  console.log("Payment error:", paymentError)

  redirect(`/dashboard/events/${event.id}?booked=true`)
}