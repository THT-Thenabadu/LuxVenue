// app/(staff)/staff/events/[id]/_components/StaffVendorsTab.jsx
"use client"

import { useState } from "react"
import { assignVendorToEvent, updateVendorStatus, removeVendorFromEvent } from "@/lib/actions/staff"
import { Truck, Plus, X, Mail, Phone } from "lucide-react"

const categoryColors = {
  florist: "bg-pink-100 text-pink-700",
  av: "bg-blue-100 text-blue-700",
  catering: "bg-orange-100 text-orange-700",
  photography: "bg-purple-100 text-purple-700",
  other: "bg-gray-100 text-gray-600",
}

const statusColors = {
  assigned: "bg-yellow-100 text-yellow-700",
  briefed: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
}

const statusOptions = ["assigned", "briefed", "confirmed", "cancelled"]

export default function StaffVendorsTab({ eventId, eventVendors, allVendors }) {
  const [vendors, setVendors] = useState(eventVendors)
  const [showAssign, setShowAssign] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState("")
  const [notes, setNotes] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState("")

  // vendors not yet assigned to this event
  const assignedVendorIds = vendors.map(v => v.vendor_id)
  const availableVendors = allVendors.filter(v => !assignedVendorIds.includes(v.id))

  async function handleAssign(e) {
    e.preventDefault()
    if (!selectedVendorId) return
    setIsAssigning(true)
    setError("")

    const result = await assignVendorToEvent(eventId, selectedVendorId, notes)

    if (result?.error) {
      setError(result.error)
    } else {
      // add to local state
      const vendor = allVendors.find(v => v.id === selectedVendorId)
      setVendors(prev => [...prev, {
        ...result.eventVendor,
        vendors: vendor
      }])
      setSelectedVendorId("")
      setNotes("")
      setShowAssign(false)
    }

    setIsAssigning(false)
  }

  async function handleStatusChange(eventVendorId, newStatus) {
    setVendors(prev =>
      prev.map(v => v.id === eventVendorId ? { ...v, status: newStatus } : v)
    )
    await updateVendorStatus(eventVendorId, newStatus)
  }

  async function handleRemove(eventVendorId) {
    setVendors(prev => prev.filter(v => v.id !== eventVendorId))
    await removeVendorFromEvent(eventVendorId)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-lg text-[#001B3C] font-semibold">
            Vendors
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} assigned
          </p>
        </div>
        {availableVendors.length > 0 && (
          <button
            onClick={() => setShowAssign(!showAssign)}
            className="flex items-center gap-2 text-sm bg-[#001B3C] text-white px-4 py-2 rounded-lg hover:bg-[#1F477B] transition-colors"
          >
            <Plus size={14} /> Assign vendor
          </button>
        )}
      </div>

      {/* assign form */}
      {showAssign && (
        <form
          onSubmit={handleAssign}
          className="bg-[#F7F9FB] rounded-xl p-5 mb-6 space-y-3"
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Select vendor
            </label>
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] bg-white transition-all"
            >
              <option value="">Choose a vendor...</option>
              {availableVendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Notes <span className="text-gray-400 normal-case">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefing notes, requirements, contact instructions..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isAssigning}
              className="bg-[#001B3C] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1F477B] transition-colors disabled:opacity-70"
            >
              {isAssigning ? "Assigning..." : "Assign"}
            </button>
            <button
              type="button"
              onClick={() => setShowAssign(false)}
              className="border border-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* assigned vendors list */}
      {vendors.length === 0 ? (
        <div className="text-center py-10">
          <Truck size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-1">No vendors assigned yet</p>
          <p className="text-xs text-gray-400">
            Assign vendors to coordinate third party suppliers for this event.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vendors.map((ev) => (
            <div
              key={ev.id}
              className="p-5 bg-[#F7F9FB] rounded-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#001B3C] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {ev.vendors?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold text-[#001B3C]">
                        {ev.vendors?.name}
                      </p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${categoryColors[ev.vendors?.category]}`}>
                        {ev.vendors?.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                      {ev.vendors?.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={11} /> {ev.vendors.email}
                        </span>
                      )}
                      {ev.vendors?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={11} /> {ev.vendors.phone}
                        </span>
                      )}
                    </div>
                    {ev.notes && (
                      <p className="text-xs text-gray-500 bg-white rounded-lg px-3 py-2 mt-2">
                        {ev.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* status selector */}
                  <select
                    value={ev.status}
                    onChange={(e) => handleStatusChange(ev.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${statusColors[ev.status]}`}
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s} className="bg-white text-gray-700 capitalize">
                        {s}
                      </option>
                    ))}
                  </select>

                  {/* remove button */}
                  <button
                    onClick={() => handleRemove(ev.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}