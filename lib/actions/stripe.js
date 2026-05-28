// lib/actions/stripe.js
"use server"

import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createCheckoutSession(paymentId, eventId) {
  const supabase = await createClient()

  // get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // get the payment record
  const { data: payment } = await supabase
    .from("payments")
    .select(`
      *,
      events (
        name,
        organiser_id
      )
    `)
    .eq("id", paymentId)
    .single()

  if (!payment) return { error: "Payment not found" }

  // make sure this payment belongs to this user
  if (payment.events?.organiser_id !== user.id) {
    return { error: "Unauthorized" }
  }

  // make sure it is not already paid
  if (payment.status === "paid") {
    return { error: "This payment has already been made" }
  }

  // create the Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "lkr",
          product_data: {
            name: `${payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} payment`,
            description: `${payment.events?.name} — LuxVenue`,
          },
          unit_amount: Math.round(parseFloat(payment.amount) * 100),
          // Stripe uses cents/smallest currency unit
          // LKR 45,000 becomes 4500000
        },
        quantity: 1,
      },
    ],
    metadata: {
      payment_id: paymentId,
      event_id: eventId,
      user_id: user.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${eventId}?tab=payments&success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${eventId}?tab=payments&cancelled=true`,
  })

  // redirect to Stripe checkout
  redirect(session.url)
}