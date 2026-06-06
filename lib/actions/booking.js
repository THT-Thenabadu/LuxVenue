// lib/actions/booking.js
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { sendBookingConfirmation } from "@/lib/email"

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

  // fetch venue price and name
  const { data: venue } = await supabase
    .from("venues")
    .select("price_per_day, name")
    .eq("id", venueId)
    .single()

  const packageTotal = bookingData.selectedPackages.reduce(
    (sum, pkg) => sum + parseFloat(pkg.price), 0
  )
  const total = (parseFloat(venue?.price_per_day) || 0) + packageTotal
  const depositAmount = total * 0.3

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

  // get planner profile for email
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", userId)
    .single()

  // send booking confirmation email
  await sendBookingConfirmation({
    to: profile?.email || "",
    plannerName: profile?.full_name || "there",
    eventName: bookingData.eventName,
    venueName: venue?.name || "your venue",
    startDate: new Date(bookingData.startDate).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    }),
    guestCount: bookingData.guestCount,
    depositAmount: depositAmount.toLocaleString(),
    eventId: event.id,
  })

  // redirect LAST — after all other operations
  redirect(`/dashboard/events/${event.id}?booked=true`)
}