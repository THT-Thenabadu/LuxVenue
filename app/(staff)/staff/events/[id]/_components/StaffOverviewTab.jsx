// app/(staff)/staff/events/[id]/_components/StaffOverviewTab.jsx
import { Package, MapPin } from "lucide-react"

export default function StaffOverviewTab({ event, eventPackages, payments }) {

  const totalPaid = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  const totalOutstanding = payments
    .filter(p => p.status === "pending" || p.status === "overdue")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* organiser info */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-serif text-lg text-[#001B3C] font-semibold mb-4">
          Organiser
        </h3>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-[#001B3C]">{event.profiles?.full_name}</p>
          <p className="text-gray-500">{event.profiles?.email}</p>
          {event.profiles?.phone && (
            <p className="text-gray-500">{event.profiles?.phone}</p>
          )}
        </div>
      </div>

      {/* payment summary */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-serif text-lg text-[#001B3C] font-semibold mb-4">
          Payment summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total paid</span>
            <span className="font-semibold text-green-600">
              LKR {totalPaid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Outstanding</span>
            <span className="font-semibold text-[#001B3C]">
              LKR {totalOutstanding.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* venue */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-serif text-lg text-[#001B3C] font-semibold mb-4">
          Venue
        </h3>
        <div className="flex items-center gap-4">
          <img
            src={event.venues?.images?.[0] || "https://placehold.co/80x80/001B3C/white?text=V"}
            alt={event.venues?.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-[#001B3C]">{event.venues?.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={12} /> {event.venues?.location}
            </p>
          </div>
        </div>
      </div>

      {/* special requests */}
      {event.special_requests && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="font-serif text-lg text-[#001B3C] font-semibold mb-3">
            Special requests
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {event.special_requests}
          </p>
        </div>
      )}

      {/* packages */}
      {eventPackages.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 lg:col-span-2">
          <h3 className="font-serif text-lg text-[#001B3C] font-semibold mb-4">
            Selected packages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventPackages.map(ep => (
              <div key={ep.id} className="flex items-center gap-3 p-4 bg-[#F7F9FB] rounded-lg">
                <Package size={16} className="text-[#1F477B] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#001B3C]">
                    {ep.packages?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {ep.packages?.category} · LKR {ep.price_at_booking?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}