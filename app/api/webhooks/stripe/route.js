// app/api/webhooks/stripe/route.js
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// use service role key here — webhook runs outside of user session
// service role bypasses RLS which is what we need here
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  let event

  // verify the webhook came from Stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  // handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    const paymentId = session.metadata?.payment_id
    const eventId = session.metadata?.event_id

    if (!paymentId) {
      return NextResponse.json({ error: "No payment ID" }, { status: 400 })
    }

    // update the payment status to paid
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        stripe_payment_id: session.payment_intent,
      })
      .eq("id", paymentId)

    if (updateError) {
      console.error("Failed to update payment:", updateError)
      return NextResponse.json(
        { error: "Failed to update payment" },
        { status: 500 }
      )
    }

    // if this was the deposit update event status to confirmed
    const { data: payment } = await supabase
      .from("payments")
      .select("type")
      .eq("id", paymentId)
      .single()

    if (payment?.type === "deposit") {
      await supabase
        .from("events")
        .update({ status: "confirmed" })
        .eq("id", eventId)
    }

    console.log(`Payment ${paymentId} marked as paid`)
  }

  return NextResponse.json({ received: true })
}