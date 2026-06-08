// app/(staff)/staff/events/[id]/page.jsx
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, MapPin } from "lucide-react"
import StaffEventTabs from "./_components/StaffEventTabs"
import StaffOverviewTab from "./_components/StaffOverviewTab"
import StaffGuestsTab from "./_components/StaffGuestsTab"
import StaffMessagesTab from "./_components/StaffMessagesTab"
import StaffPaymentsTab from "./_components/StaffPaymentsTab"
import StaffVendorsTab from "./_components/StaffVendorsTab"

export default async function StaffEventDetailPage({ params, searchParams }) {
  const supabase = await createClient()

  const { id } = await params
  const resolvedSearchParams = await searchParams
  const tab = resolvedSearchParams?.tab || "overview"

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/signin")

  const { data: staffMember } = await supabase
    .from("staff_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!staffMember) redirect("/dashboard")

  // staff can see any event — no organiser_id filter
  const { data: event } = await supabase
    .from("events")
    .select(`
      *,
      venues (id, name, location, images, price_per_day),
      profiles!events_organiser_id_fkey (full_name, email, phone)
    `)
    .eq("id", id)
    .single()

  if (!event) notFound()

  const { data: guests } = await supabase
    .from("event_guests")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: false })

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("event_id", id)
    .order("due_date", { ascending: true })

  const { data: messages } = await supabase
    .from("messages")
    .select(`
      *,
      profiles (full_name, avatar_url)
    `)
    .eq("event_id", id)
    .order("created_at", { ascending: true })

  const { data: eventPackages } = await supabase
    .from("event_packages")
    .select(`
      *,
      packages (name, category, price)
    `)
    .eq("event_id", id)

  const statusColors = {
    enquiry: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  }

  const { data: eventVendors } = await supabase
  .from("event_vendors")
  .select(`
    *,
    vendors (id, name, category, email, phone)
  `)
  .eq("event_id", id)

const { data: allVendors } = await supabase
  .from("vendors")
  .select("*")
  .order("name", { ascending: true })

  return (
    <div className="p-6 md:p-10">

      <Link
        href="/staff/events"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#001B3C] transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Back to bookings
      </Link>

      {/* event header */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-serif text-2xl md:text-3xl text-[#001B3C] font-semibold">
                {event.name}
              </h1>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[event.status]}`}>
                {event.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
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
            <p className="text-xs text-gray-400">
              Organiser: {event.profiles?.full_name} · {event.profiles?.email}
            </p>
          </div>

          {/* status update — managers and coordinators can change status */}
          <StatusUpdater
            eventId={id}
            currentStatus={event.status}
            role={staffMember.role}
          />

        </div>
      </div>

      <StaffEventTabs activeTab={tab} eventId={id} />

      <div className="mt-6">
        {tab === "overview" && (
          <StaffOverviewTab
            event={event}
            eventPackages={eventPackages || []}
            payments={payments || []}
          />
        )}
        {tab === "guests" && (
          <StaffGuestsTab guests={guests || []} />
        )}
        {tab === "payments" && (
          <StaffPaymentsTab
            payments={payments || []}
            eventId={id}
            role={staffMember.role}
          />
        )}
        {tab === "messages" && (
          <StaffMessagesTab
            eventId={id}
            initialMessages={messages || []}
            currentUserId={user.id}
            currentUserName={event.profiles?.full_name || user.email}
          />
        )}
                {tab === "vendors" && (
          <StaffVendorsTab
            eventId={id}
            eventVendors={eventVendors || []}
            allVendors={allVendors || []}
          />
        )}
      </div>

    </div>
  )
}

// inline status updater component
function StatusUpdater({ eventId, currentStatus, role }) {
  return (
    <form action={async (formData) => {
      "use server"
      const { createClient } = await import("@/lib/supabase/server")
      const supabase = await createClient()
      const newStatus = formData.get("status")
      await supabase
        .from("events")
        .update({ status: newStatus })
        .eq("id", eventId)
    }}>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Update status
        </label>
        <div className="flex gap-2">
          <select
            name="status"
            defaultValue={currentStatus}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] bg-white"
          >
            <option value="enquiry">Enquiry</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            className="bg-[#001B3C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1F477B] transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </form>
  )
}