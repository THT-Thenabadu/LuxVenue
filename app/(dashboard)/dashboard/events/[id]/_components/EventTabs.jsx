// app/(dashboard)/dashboard/events/[id]/_components/EventTabs.jsx
"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { LayoutGrid, CheckSquare, Users, CreditCard, MessageSquare, Clock } from "lucide-react"

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "checklist", label: "Checklist", icon: CheckSquare },
  { id: "guests", label: "Guests", icon: Users },
  { id: "payments", label: "Payments", icon: CreditCard },
]

export default function EventTabs({ activeTab, eventId }) {
  return (
    <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`/dashboard/events/${eventId}?tab=${tab.id}`}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === tab.id
              ? "bg-[#001B3C] text-white"
              : "text-gray-500 hover:text-[#001B3C] hover:bg-gray-50"
          }`}
        >
          <tab.icon size={15} />
          {tab.label}
        </Link>
      ))}
    </div>
  )
}