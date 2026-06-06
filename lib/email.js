// lib/email.js
import { Resend } from "resend"
import { render } from "@react-email/components"
import BookingConfirmationEmail from "@/emails/BookingConfirmation"
import PaymentReceiptEmail from "@/emails/PaymentReceipt"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "LuxVenue <onboarding@resend.dev>"

export async function sendBookingConfirmation({ to, plannerName, eventName, venueName, startDate, guestCount, depositAmount, eventId }) {
  const eventUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${eventId}`

  const html = await render(
    BookingConfirmationEmail({ plannerName, eventName, venueName, startDate, guestCount, depositAmount, eventUrl })
  )

  console.log("Sending booking confirmation to:", to)

  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `Booking confirmed — ${eventName} at ${venueName}`,
    html,
  })

  console.log("Email result:", data)
  console.log("Email error:", error)

  if (error) console.error("Booking confirmation email error:", error)
  return { error }
}

export async function sendPaymentReceipt({
  to,
  plannerName,
  eventName,
  paymentType,
  amount,
  paidAt,
  eventId,
}) {
  const eventUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${eventId}?tab=payments`

  const html = await render(
    PaymentReceiptEmail({
      plannerName,
      eventName,
      paymentType,
      amount,
      paidAt,
      eventUrl,
    })
  )

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `Payment received — ${eventName}`,
    html,
  })

  if (error) console.error("Payment receipt email error:", error)
  return { error }
}