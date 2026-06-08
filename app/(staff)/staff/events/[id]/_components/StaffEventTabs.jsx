// app/(staff)/staff/events/[id]/_components/StaffEventTabs.jsx
"use client"

import Link from "next/link"
import { LayoutGrid, Users, CreditCard, MessageSquare, Truck } from "lucide-react"

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "guests", label: "Guests", icon: Users },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "vendors", label: "Vendors", icon: Truck },
  { id: "messages", label: "Messages", icon: MessageSquare },
]

export default function StaffEventTabs({ activeTab, eventId }) {
  return (
    <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`/staff/events/${eventId}?tab=${tab.id}`}
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