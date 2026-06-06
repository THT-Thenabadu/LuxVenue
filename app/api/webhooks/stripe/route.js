// app/api/webhooks/stripe/route.js
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { sendPaymentReceipt } from "@/lib/email"

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
    
    // get event and planner details for the receipt email
const { data: eventData } = await supabase
  .from("events")
  .select(`
    name,
    profiles!events_organiser_id_fkey (full_name, email)
  `)
  .eq("id", eventId)
  .single()

const { data: paymentData } = await supabase
  .from("payments")
  .select("type, amount, paid_at")
  .eq("id", paymentId)
  .single()

if (eventData && paymentData) {
  await sendPaymentReceipt({
    to: eventData.profiles?.email || "",
    plannerName: eventData.profiles?.full_name || "there",
    eventName: eventData.name,
    paymentType: paymentData.type,
    amount: parseFloat(paymentData.amount).toLocaleString(),
    paidAt: new Date(paymentData.paid_at).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric"
    }),
    eventId,
  })
}
  }

  return NextResponse.json({ received: true })
}