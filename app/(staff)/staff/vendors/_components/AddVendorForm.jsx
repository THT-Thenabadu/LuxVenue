// app/(staff)/staff/vendors/_components/AddVendorForm.jsx
"use client"

import { useState } from "react"
import { addVendor } from "@/lib/actions/staff"

const categories = [
  { value: "florist", label: "Florist" },
  { value: "av", label: "AV / Audio Visual" },
  { value: "catering", label: "Catering" },
  { value: "photography", label: "Photography" },
  { value: "other", label: "Other" },
]

export default function AddVendorForm() {
  const [form, setForm] = useState({
    name: "",
    category: "other",
    email: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const result = await addVendor(form)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(`${form.name} added successfully`)
      setForm({ name: "", category: "other", email: "", phone: "" })
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
          Vendor name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder="Bloom Florals"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] bg-white transition-all"
        >
          {categories.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
          placeholder="vendor@example.com"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Phone
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
          placeholder="+94 77 123 4567"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#001B3C] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-colors disabled:opacity-70"
      >
        {isLoading ? "Adding..." : "Add vendor"}
      </button>

    </form>
  )
}