// app/(dashboard)/dashboard/events/[id]/page.jsx
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, MapPin } from "lucide-react"
import EventTabs from "./_components/EventTabs"
import ChecklistTab from "./_components/ChecklistTab"
import GuestsTab from "./_components/GuestsTab"
import PaymentsTab from "./_components/PaymentsTab"
import OverviewTab from "./_components/OverviewTab"
import MessagesTab from "./_components/MessagesTab"
import RunOfShowTab from "./_components/RunOfShowTab"

export default async function EventDetailPage({ params, searchParams }) {
  const supabase = await createClient()

  const { id } = await params
  const resolvedSearchParams = await searchParams
  const tab = resolvedSearchParams?.tab || "overview"

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/signin")

  const { data: event } = await supabase
    .from("events")
    .select(`
      *,
      venues (
        id,
        name,
        location,
        images,
        price_per_day
      )
    `)
    .eq("id", id)
    .eq("organiser_id", user.id)
    .single()

  if (!event) notFound()

  const { data: checklist } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("event_id", id)
    .order("due_date", { ascending: true })

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

    const { data: runOfShow } = await supabase
  .from("run_of_show")
  .select("*")
  .eq("event_id", id)
  .order("order_index", { ascending: true })

  const { data: eventPackages } = await supabase
    .from("event_packages")
    .select(`
      *,
      packages (name, category, price)
    `)
    .eq("event_id", id)

  const totalItems = checklist?.length || 0
  const completedItems = checklist?.filter(i => i.is_completed).length || 0
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const statusColors = {
    enquiry: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  }

  return (
    <div className="p-6 md:p-10">

      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#001B3C] transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

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

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {event.venues?.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {new Date(event.start_date).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric"
                })}
                {event.end_date !== event.start_date && (
                  <> → {new Date(event.end_date).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric"
                  })}</>
                )}
              </span>
              <span className="flex items-center gap-1">
                <Users size={13} /> {event.guest_count} guests
              </span>
            </div>
          </div>

          <div className="w-full md:w-48">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Event readiness</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#001B3C] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {completedItems} of {totalItems} tasks complete
            </p>
          </div>

        </div>
      </div>

      <EventTabs activeTab={tab} eventId={id} />

      <div className="mt-6">
        {tab === "overview" && (
          <OverviewTab
            event={event}
            eventPackages={eventPackages || []}
            payments={payments || []}
          />
        )}
        {tab === "checklist" && (
          <ChecklistTab
            eventId={id}
            checklist={checklist || []}
          />
        )}
        {tab === "guests" && (
          <GuestsTab
            eventId={id}
            guests={guests || []}
          />
        )}
        {tab === "payments" && (
          <PaymentsTab
            payments={payments || []}
            eventId={id}
          />
        )}
        {tab === "messages" && (
          <MessagesTab
            eventId={id}
            initialMessages={messages || []}
            currentUserId={user.id}
            currentUserName={user.email}
          />
        )}
        {tab === "runofshow" && (
              <RunOfShowTab
                eventId={id}
                initialItems={runOfShow || []}
              />
            )}
      </div>

    </div>
  )
}