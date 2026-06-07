// app/rsvp/[token]/page.jsx
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import RSVPForm from "./_components/RSVPForm"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

export default async function RSVPPage({ params }) {
  const supabase = await createClient()

  const { token } = await params

  // find the guest by their token
  const { data: guest, error } = await supabase
    .from("event_guests")
    .select(`
      *,
      events (
        id,
        name,
        event_type,
        start_date,
        end_date,
        start_time,
        end_time,
        guest_count,
        venues (
          name,
          location,
          images
        )
      )
    `)
    .eq("qr_token", token)
    .single()

  if (error || !guest) notFound()

  const event = guest.events
  const venue = event?.venues

  return (
    <main className="min-h-screen bg-[#F7F9FB]">

      {/* header */}
      <div className="bg-[#001B3C] px-6 py-8 text-center">
        <span className="font-serif text-white text-2xl font-semibold">
          LuxVenue
        </span>
      </div>

      {/* venue image */}
      {venue?.images?.[0] && (
        <div className="w-full h-48 md:h-64 overflow-hidden">
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-lg mx-auto px-6 py-8">

        {/* event details card */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">

          <div className="mb-5">
            <p className="text-xs font-semibold text-[#1F477B] uppercase tracking-widest mb-1">
              You are invited
            </p>
            <h1 className="font-serif text-2xl text-[#001B3C] font-semibold mb-1">
              {event?.name}
            </h1>
            <p className="text-sm text-gray-500 capitalize">
              {event?.event_type?.replace("_", " ")}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar size={16} className="text-[#1F477B] flex-shrink-0" />
              <span>
                {new Date(event?.start_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </div>

            {event?.start_time && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock size={16} className="text-[#1F477B] flex-shrink-0" />
                <span>
                  {event.start_time.slice(0, 5)}
                  {event.end_time && ` — ${event.end_time.slice(0, 5)}`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin size={16} className="text-[#1F477B] flex-shrink-0" />
              <span>{venue?.name} · {venue?.location}</span>
            </div>

          </div>

        </div>

        {/* guest name */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <p className="text-xs text-gray-400 mb-1">Your invitation</p>
          <p className="font-semibold text-[#001B3C]">{guest.name}</p>
          <p className="text-sm text-gray-500">{guest.email}</p>
        </div>

        {/* RSVP form */}
        <RSVPForm
          guestId={guest.id}
          token={token}
          currentRsvp={guest.rsvp_status}
          currentDietary={guest.dietary_needs}
          currentNotes={guest.dietary_notes}
          isCheckedIn={guest.checked_in}
        />

      </div>

      {/* footer */}
      <div className="text-center py-8">
        <p className="text-xs text-gray-400">
          Powered by LuxVenue · This link is personal to {guest.name}
        </p>
      </div>

    </main>
  )
}