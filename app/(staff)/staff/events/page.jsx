// app/(staff)/staff/events/page.jsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Calendar, MapPin, Users, ArrowRight, Search } from "lucide-react"

export default async function StaffEventsPage({ searchParams }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/signin")

  const { data: staffMember } = await supabase
    .from("staff_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!staffMember) redirect("/dashboard")

  const resolvedSearchParams = await searchParams
  const statusFilter = resolvedSearchParams?.status || ""

  let query = supabase
    .from("events")
    .select(`
      *,
      venues (name, location),
      profiles!events_organiser_id_fkey (full_name, email)
    `)
    .order("start_date", { ascending: true })

  if (statusFilter) {
    query = query.eq("status", statusFilter)
  }

  const { data: events } = await query

  const statusColors = {
    enquiry: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  }

  const statuses = ["enquiry", "confirmed", "in_progress", "completed", "cancelled"]

  return (
    <div className="p-6 md:p-10">

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#001B3C] font-semibold mb-1">
          All bookings
        </h1>
        <p className="text-gray-500 text-sm">
          {events?.length || 0} total bookings
        </p>
      </div>

      {/* status filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/staff/events"
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            !statusFilter
              ? "bg-[#001B3C] text-white"
              : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
          }`}
        >
          All
        </Link>
        {statuses.map(status => (
          <Link
            key={status}
            href={`/staff/events?status=${status}`}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors capitalize ${
              statusFilter === status
                ? "bg-[#001B3C] text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
            }`}
          >
            {status.replace("_", " ")}
          </Link>
        ))}
      </div>

      {/* events list */}
      {events && events.length > 0 ? (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/staff/events/${event.id}`}
              className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-serif text-lg text-[#001B3C] font-semibold">
                    {event.name}
                  </h2>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {event.venues?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric"
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {event.guest_count} guests
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Organiser: {event.profiles?.full_name} · {event.profiles?.email}
                </p>
              </div>
              <ArrowRight size={18} className="text-gray-400 flex-shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-xl">
          <Calendar size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">No bookings found</p>
        </div>
      )}

    </div>
  )
}