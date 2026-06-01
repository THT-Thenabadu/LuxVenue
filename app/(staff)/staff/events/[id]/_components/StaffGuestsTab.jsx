// app/(staff)/staff/events/[id]/_components/StaffGuestsTab.jsx
import { Users, Mail } from "lucide-react"

const rsvpColors = {
  pending: "bg-yellow-100 text-yellow-700",
  attending: "bg-green-100 text-green-700",
  not_attending: "bg-red-100 text-red-600",
}

export default function StaffGuestsTab({ guests }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="mb-5">
        <h3 className="font-serif text-lg text-[#001B3C] font-semibold">
          Guest list
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {guests.length} total ·{" "}
          {guests.filter(g => g.rsvp_status === "attending").length} attending ·{" "}
          {guests.filter(g => g.dietary_needs && g.dietary_needs !== "none").length} dietary needs
        </p>
      </div>

      {guests.length === 0 ? (
        <div className="text-center py-10">
          <Users size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No guests added yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {guests.map((guest) => (
            <div key={guest.id} className="flex items-center gap-4 p-4 bg-[#F7F9FB] rounded-xl">
              <div className="w-9 h-9 rounded-full bg-[#001B3C] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {guest.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#001B3C] truncate">
                  {guest.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Mail size={11} /> {guest.email}
                  </span>
                  {guest.dietary_needs && guest.dietary_needs !== "none" && (
                    <span className="text-xs text-orange-500 font-medium capitalize">
                      {guest.dietary_needs.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${rsvpColors[guest.rsvp_status]}`}>
                {guest.rsvp_status === "not_attending" ? "Declined" : guest.rsvp_status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}