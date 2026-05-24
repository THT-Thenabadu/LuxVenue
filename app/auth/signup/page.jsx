// app/(auth)/signup/page.jsx
"use client"

import { useState } from "react"
import Link from "next/link"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("planner")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  function getStrengthBars() {
    if (password.length === 0) return 0
    if (password.length < 4) return 1
    if (password.length < 8) return 2
    if (password.length < 12) return 3
    return 4
  }

  function getBarColor(barIndex) {
    const strength = getStrengthBars()
    if (strength === 0) return "bg-gray-200"
    if (barIndex > strength) return "bg-gray-200"
    if (strength === 1) return "bg-red-400"
    if (strength === 2) return "bg-yellow-400"
    if (strength === 3) return "bg-blue-400"
    return "bg-[#001B3C]"
  }

  function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1500)
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel — branding ── */}
      <section className="hidden lg:flex w-1/2 relative bg-[#003366] overflow-hidden">

        {/* background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcKTnmLhqEkAAUkOjegqcdLDIHrgs7oVc4ET3xQtmNlh0FWVDal5_VSyf5OzbzwlYxPczavkwf-yahdRBysoHR_46dqspTQ5CkPGEVlac7DTJmJVWUFEuXdYPrj4ScCfHxW3MHTEw1r1Xp-s7InIKVeXlYzBdFdB-tInX7IafVMPrTjpbPQfIW3l9y3lOJK7tF5FjkT8ZuHcORCgrcnMNo3jcyo6RWHKmh3FgWm9HlIFCjjpDIAVaYOvHRzMUW4oGqvwIIGQ2woAc"
            alt="LuxVenue venue"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        </div>

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001B3C]/80 to-transparent pointer-events-none z-10" />

        {/* content */}
        <div className="relative z-20 p-12 flex flex-col justify-between w-full">

          {/* logo */}
          <div>
            <span className="font-serif text-white text-2xl font-semibold">LuxVenue</span>
          </div>

          {/* headline */}
          <div className="max-w-xl">
            <h1 className="font-serif text-5xl text-white font-bold leading-tight mb-6">
              Architectural precision in every reservation.
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Join an exclusive community of elite event organizers who value intentionality, space, and refined detail.
            </p>
          </div>

          {/* social proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {["bg-gray-300", "bg-gray-400", "bg-gray-500"].map((bg, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#003366] ${bg}`} />
              ))}
            </div>
            <span className="text-white text-sm font-medium">
              Trusted by 2,000+ top-tier planners globally.
            </span>
          </div>

        </div>
      </section>

      {/* ── Right panel — form ── */}
      <section className="flex-1 flex flex-col items-center justify-center bg-white px-6 md:px-12 py-12 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <span className="font-serif text-[#001B3C] text-2xl font-semibold">LuxVenue</span>
          </div>

          {/* heading */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="font-serif text-3xl text-[#001B3C] font-semibold mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-500 text-sm">
              Join our community of elite event organizers.
            </p>
          </div>

          {/* google oauth */}
          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all duration-300 mb-6 active:scale-[0.98]">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.13l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* divider */}
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-200" />
            <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase tracking-widest">
              Or sign up with email
            </span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* account type */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "planner", label: "Event Planner", icon: "👤" },
                { value: "staff", label: "Hotel Staff", icon: "🏨" },
              ].map((type) => (
                <label key={type.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={type.value}
                    checked={role === type.value}
                    onChange={(e) => setRole(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="p-4 border border-gray-200 rounded-lg flex flex-col items-center gap-2 peer-checked:border-[#001B3C] peer-checked:bg-[#001B3C]/5 transition-all duration-300 text-center">
                    <span className="text-xl">{type.icon}</span>
                    <span className="text-xs font-semibold text-[#001B3C]">{type.label}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* access code — only shown for hotel staff */}
            {role === "staff" && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                  Hotel Access Code
                </label>
                <input
                  type="text"
                  placeholder="Enter your hotel invite code"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
                />
                <p className="text-xs text-gray-400 ml-1">
                  Contact your hotel manager if you don't have a code.
                </p>
              </div>
            )}

            {/* name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Julian"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Asher"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
                />
              </div>
            </div>

            {/* email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="julian@luxvenue.com"
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
              />
            </div>

            {/* password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#001B3C] transition-colors text-xs font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* strength bars */}
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${getBarColor(bar)}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1 italic">
                Use 8+ characters with a mix of letters, numbers and symbols.
              </p>
            </div>

            {/* confirm password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
              />
            </div>

            {/* checkboxes */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-gray-300 accent-[#001B3C]"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/legal/terms" className="text-[#001B3C] font-semibold underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/privacy" className="text-[#001B3C] font-semibold underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  . — required
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 accent-[#001B3C]"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  Keep me updated on exclusive venue releases and offers via email. — optional
                </span>
              </label>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-4 bg-[#001B3C] text-white rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-all duration-300 active:scale-[0.98] mt-2 disabled:opacity-70"
            >
              {isSuccess
                ? "Welcome to LuxVenue ✓"
                : isLoading
                ? "Creating your account..."
                : "Create My Account"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#001B3C] font-semibold hover:underline">
                Log in
              </Link>
            </p>

          </form>

          {/* oauth disclosure */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              Google OAuth will share your name, email, and profile picture to simplify registration.
              View our{" "}
              <Link href="/legal/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

        </div>
      </section>

    </main>
  )
}