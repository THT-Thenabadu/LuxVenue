// app/(staff)/staff/team/_components/InviteForm.jsx
"use client"

import { useState } from "react"
import { sendStaffInvite } from "@/lib/actions/staff"
import { Send } from "lucide-react"

export default function InviteForm({ invitedBy }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("coordinator")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const result = await sendStaffInvite(email, role, invitedBy)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(`Invite sent to ${email}`)
      setEmail("")
      setRole("coordinator")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="coordinator@hotel.com"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] bg-white transition-all"
        >
          <option value="coordinator">Coordinator</option>
          <option value="manager">Manager</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Coordinators manage events. Managers have full access including team management.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-[#001B3C] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-colors disabled:opacity-70"
      >
        <Send size={15} />
        {isLoading ? "Sending invite..." : "Send invite"}
      </button>

    </form>
  )
}