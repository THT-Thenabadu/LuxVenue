// app/(dashboard)/dashboard/page.jsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar, Users, CreditCard, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // fetch events the user is organising
  const { data: organisingEvents } = await supabase
    .from("events")
    .select(`
      *,
      venues (name, location)
    `)
    .eq("organiser_id", user.id)
    .order("start_date", { ascending: true })
    .limit(5)

  // fetch events the user is attending as a guest
  const { data: attendingEvents } = await supabase
    .from("event_guests")
    .select(`
      *,
      events (
        id,
        name,
        start_date,
        event_type,
        venues (name)
      )
    `)
    .eq("email", user.email)
    .eq("rsvp_status", "attending")
    .limit(5)

  // fetch upcoming payments
  const { data: upcomingPayments } = await supabase
    .from("payments")
    .select(`
      *,
      events (name)
    `)
    .in("status", ["pending", "overdue"])
    .order("due_date", { ascending: true })
    .limit(3)

  return (
    <div className="p-6 md:p-10">

      {/* header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#001B3C] font-semibold mb-1">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Welcome back. Here is everything happening with your events.
        </p>
      </div>

      {/* stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          {
            icon: Calendar,
            label: "Events organising",
            value: organisingEvents?.length || 0
          },
          {
            icon: Users,
            label: "Events attending",
            value: attendingEvents?.length || 0
          },
          {
            icon: CreditCard,
            label: "Payments due",
            value: upcomingPayments?.length || 0
          },
          {
            icon: Clock,
            label: "Pending RSVPs",
            value: 0
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon size={16} className="text-[#1F477B]" />
              <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
            </div>
            <p className="text-3xl font-semibold text-[#001B3C]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* events i am organising */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold">
              Events I am organising
            </h2>
            <Link
              href="/dashboard/events"
              className="text-xs text-[#1F477B] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {organisingEvents && organisingEvents.length > 0 ? (
            <div className="flex flex-col gap-3">
              {organisingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="flex items-center justify-between p-4 bg-[#F7F9FB] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#001B3C]">{event.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {event.venues?.name} · {new Date(event.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    event.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : event.status === "enquiry"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {event.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400 mb-4">No events yet</p>
              <Link
                href="/venues"
                className="text-sm bg-[#001B3C] text-white px-5 py-2 rounded-lg hover:bg-[#1F477B] transition-colors"
              >
                Browse venues
              </Link>
            </div>
          )}
        </div>

        {/* events i am attending */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold">
              Events I am attending
            </h2>
          </div>

          {attendingEvents && attendingEvents.length > 0 ? (
            <div className="flex flex-col gap-3">
              {attendingEvents.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-4 bg-[#F7F9FB] rounded-lg"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#001B3C]">
                      {guest.events?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {guest.events?.venues?.name} · {guest.events?.start_date && new Date(guest.events.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    {guest.rsvp_status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Users size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                No events to attend yet. You will see events here when someone invites you.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* upcoming payments */}
      {upcomingPayments && upcomingPayments.length > 0 && (
        <div className="mt-8 bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold">
              Upcoming payments
            </h2>
            <Link
              href="/dashboard/payments"
              className="text-xs text-[#1F477B] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-[#F7F9FB] rounded-lg"
              >
                <div>
                  <p className="text-sm font-semibold text-[#001B3C]">
                    {payment.events?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {payment.type} · due {new Date(payment.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#001B3C]">
                    LKR {payment.amount?.toLocaleString()}
                  </p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    payment.status === "overdue"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}