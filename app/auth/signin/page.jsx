// app/(auth)/login/page.jsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { logIn } from "@/lib/actions/auth"
import { Shield } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.target)
    const result = await logIn(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">

      {/* left panel */}
      <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#001e40]/90 to-[#003366]/70" />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhxcx8MHMJLf5n9cO7HgjVvoNL5VupkSRIIoY7HIKJ9N1Ct-oXHpoTnxSyLfQKO9KXrtB7-QnOSFmyPeSYRJS_pqMctH8TYPQSHfgYmcTbN6rQsprfVdQ226GBmIPJHouEtcRLwxp0ozDm_FrJSamaurBrI-Srch5m7Mtm_Cnk-m2gwjYG31IMKGh2m6OgIdaw5DnmqMHqOe0nJSz6bUYprs4v9-naZ2rQpI3FXGYtf2S7wkFnHok2GN9i1ex_sPVnOt7B3RbQQcE"
            alt="LuxVenue interior"
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="relative z-20 px-12 text-center max-w-2xl">
          <span className="font-serif text-white text-3xl font-bold block mb-12">LuxVenue</span>
          <h2 className="font-serif text-4xl lg:text-5xl text-white font-bold leading-tight tracking-tight mb-6">
            Architectural precision in every reservation.
          </h2>
          <div className="w-16 h-1 bg-white/40 mx-auto rounded-full" />
        </div>
        <div className="absolute bottom-12 left-12 z-20 opacity-40 border-l border-white pl-4">
          <p className="text-white text-xs uppercase tracking-widest">Est. 2024</p>
          <p className="text-white text-xs uppercase tracking-widest">Global Portfolio</p>
        </div>
      </section>

      {/* right panel */}
      <section className="flex-1 bg-white flex flex-col items-center justify-center px-6 md:px-12 py-12">
        <div className="w-full max-w-md">

          <div className="md:hidden flex justify-center mb-10">
            <span className="font-serif text-[#001B3C] text-2xl font-semibold">LuxVenue</span>
          </div>

          <header className="mb-8">
            <h1 className="font-serif text-3xl text-[#001B3C] font-semibold mb-2">
              Sign In to LuxVenue
            </h1>
            <p className="text-gray-500 text-sm">
              Welcome back. Please enter your credentials to manage your events.
            </p>
          </header>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-lg text-sm font-medium text-[#001B3C] hover:bg-gray-50 transition-all duration-300 active:scale-[0.98] mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.67l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-200" />
            <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase tracking-widest">
              Or sign in with email
            </span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 mb-5 text-sm">
              <span>⚠</span> {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`space-y-5 ${shake ? "animate-shake" : ""}`}
          >

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="architect@luxvenue.com"
                required
                autoFocus
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1 mr-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-[#001B3C] hover:underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-16 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#001B3C] focus:ring-2 focus:ring-[#001B3C]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-[#001B3C] transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#001B3C] text-white py-4 rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 mt-2"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#001B3C] font-semibold hover:underline underline-offset-4 ml-1">
              Create Account
            </Link>
          </p>

          <footer className="mt-12 pt-8 border-t border-gray-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield size={14} className="text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                Secure Session Handling
              </p>
            </div>
            <p className="text-xs text-gray-400 px-6 leading-relaxed">
              LuxVenue uses encryption to secure your data and event details.
            </p>
          </footer>

        </div>
      </section>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>

    </main>
  )
}