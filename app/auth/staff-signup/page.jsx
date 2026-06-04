// app/(auth)/staff-signup/page.jsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { validateInviteToken, acceptStaffInvite } from "@/lib/actions/staff"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export default function StaffSignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [invite, setInvite] = useState(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isInvalid, setIsInvalid] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setIsInvalid(true)
        setIsValidating(false)
        return
      }

      const result = await validateInviteToken(token)
      if (result?.invite) {
        setInvite(result.invite)
      } else {
        setIsInvalid(true)
      }
      setIsValidating(false)
    }

    validateToken()
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    setError("")

    const result = await acceptStaffInvite(
      token,
      `${form.firstName} ${form.lastName}`,
      form.password
    )

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    router.push("/staff/dashboard")
  }

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">Validating your invite...</p>
      </div>
    )
  }

  if (isInvalid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-2xl text-[#001B3C] font-semibold mb-3">
            Invalid or expired invite
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This invite link is invalid or has expired. Please ask your manager to send a new invite.
          </p>
          <Link href="/auth/signin" className="text-sm text-[#001B3C] font-semibold hover:underline">
            Go to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">

      {/* left panel */}
      <section className="hidden lg:flex w-1/2 relative bg-[#003366] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcKTnmLhqEkAAUkOjegqcdLDIHrgs7oVc4ET3xQtmNlh0FWVDal5_VSyf5OzbzwlYxPczavkwf-yahdRBysoHR_46dqspTQ5CkPGEVlac7DTJmJVWUFEuXdYPrj4ScCfHxW3MHTEw1r1Xp-s7InIKVeXlYzBdFdB-tInX7IafVMPrTjpbPQfIW3l9y3lOJK7tF5FjkT8ZuHcORCgrcnMNo3jcyo6RWHKmh3FgWm9HlIFCjjpDIAVaYOvHRzMUW4oGqvwIIGQ2woAc"
            alt="LuxVenue"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#001B3C]/80 to-transparent z-10" />
        <div className="relative z-20 p-12 flex flex-col justify-between w-full">
          <span className="font-serif text-white text-2xl font-semibold">LuxVenue</span>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={20} className="text-white/70" />
              <span className="text-white/70 text-sm font-medium uppercase tracking-widest">
                Staff portal
              </span>
            </div>
            <h1 className="font-serif text-4xl text-white font-bold leading-tight">
              Join the LuxVenue team.
            </h1>
          </div>
          <div />
        </div>
      </section>

      {/* right panel */}
      <section className="flex-1 flex flex-col items-center justify-center bg-white px-6 md:px-12 py-12">
        <div className="w-full max-w-md">

          <div className="lg:hidden mb-10 flex justify-center">
            <span className="font-serif text-[#001B3C] text-2xl font-semibold">LuxVenue</span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#001B3C]/10 text-[#001B3C] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <ShieldCheck size={12} />
              Staff invitation
            </div>
            <h2 className="font-serif text-3xl text-[#001B3C] font-semibold mb-2">
              Create your staff account
            </h2>
            <p className="text-gray-500 text-sm">
              You have been invited as a{" "}
              <span className="font-semibold text-[#001B3C] capitalize">
                {invite?.role}
              </span>
              . Set up your account below.
            </p>
          </div>

          {/* pre-filled email */}
          <div className="bg-[#F7F9FB] rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#001B3C] text-white flex items-center justify-center text-xs font-semibold">
              {invite?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-400">Invited email</p>
              <p className="text-sm font-medium text-[#001B3C]">{invite?.email}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                  First name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm(p => ({ ...p, firstName: e.target.value }))}
                  placeholder="Julian"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                  Last name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm(p => ({ ...p, lastName: e.target.value }))}
                  placeholder="Asher"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Confirm password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#001B3C] text-white py-4 rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-colors disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Create staff account"}
            </button>

          </form>

        </div>
      </section>

    </main>
  )
}