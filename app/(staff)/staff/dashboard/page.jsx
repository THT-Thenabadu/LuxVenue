// app/(staff)/staff/dashboard/page.jsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Calendar, Users, CreditCard,
  Clock, ArrowRight, CheckCircle,
  AlertCircle
} from "lucide-react"

export default async function StaffDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/signin")

  // verify staff
  const { data: staffMember } = await supabase
    .from("staff_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!staffMember) redirect("/dashboard")

  // fetch all events with venue and organiser info
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      venues (name, location),
      profiles!events_organiser_id_fkey (full_name, email)
    `)
    .order("start_date", { ascending: true })

  // fetch pending payments
  const { data: pendingPayments } = await supabase
    .from("payments")
    .select(`
      *,
      events (name)
    `)
    .in("status", ["pending", "overdue"])
    .order("due_date", { ascending: true })
    .limit(5)

  // stats
  const totalEvents = events?.length || 0
  const confirmedEvents = events?.filter(e => e.status === "confirmed").length || 0
  const enquiryEvents = events?.filter(e => e.status === "enquiry").length || 0
  const upcomingToday = events?.filter(e =>
    new Date(e.start_date).toDateString() === new Date().toDateString()
  ).length || 0

  const statusColors = {
    enquiry: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  }

  return (
    <div className="p-6 md:p-10">

      {/* header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#001B3C] font-semibold mb-1">
          Staff overview
        </h1>
        <p className="text-gray-500 text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric", year: "numeric"
          })}
        </p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Calendar, label: "Total bookings", value: totalEvents, color: "text-[#1F477B]" },
          { icon: CheckCircle, label: "Confirmed", value: confirmedEvents, color: "text-green-500" },
          { icon: Clock, label: "Enquiries", value: enquiryEvents, color: "text-yellow-500" },
          { icon: AlertCircle, label: "Today", value: upcomingToday, color: "text-blue-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon size={16} className={stat.color} />
              <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
            </div>
            <p className="text-3xl font-semibold text-[#001B3C]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* recent bookings */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold">
              Recent bookings
            </h2>
            <Link
              href="/staff/events"
              className="text-xs text-[#1F477B] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="flex flex-col gap-3">
              {events.slice(0, 5).map((event) => (
                <Link
                  key={event.id}
                  href={`/staff/events/${event.id}`}
                  className="flex items-center justify-between p-4 bg-[#F7F9FB] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#001B3C]">
                      {event.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {event.venues?.name} · {new Date(event.start_date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {event.profiles?.full_name}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${statusColors[event.status]}`}>
                    {event.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No bookings yet</p>
            </div>
          )}
        </div>

        {/* pending payments */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold">
              Pending payments
            </h2>
          </div>

          {pendingPayments && pendingPayments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-[#F7F9FB] rounded-lg"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#001B3C]">
                      {payment.events?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">
                      {payment.type} · Due {new Date(payment.due_date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#001B3C]">
                      LKR {parseFloat(payment.amount).toLocaleString()}
                    </p>
                    <span className={`text-xs font-medium ${
                      payment.status === "overdue" ? "text-red-500" : "text-yellow-600"
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CreditCard size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No pending payments</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}