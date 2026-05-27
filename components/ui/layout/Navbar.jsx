"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { logOut } from "@/lib/actions/auth"

const navLinkClass = "font-serif text-[#001B3C] text-base relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-[#1F477B] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"

const buttonClass = "font-serif flex justify-center items-center rounded-xl bg-[#001B3C] text-white px-4 py-2 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md"

export default function Navbar({ transparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // get current session
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // get their profile for name and avatar
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single()
        setProfile(profile)
      }
    }

    getUser()

    // listen for auth changes — login/logout updates navbar instantly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        if (!session?.user) setProfile(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // get initials from full name for avatar fallback
  function getInitials(name) {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <nav className={`bg-[#E2E2E2] text-black px-6 h-20 w-full shadow-md relative ${transparent ? "absolute top-0 left-0 z-50 bg-transparent" : ""}`}>

      <div className="flex justify-between items-center h-full">

        {/* logo */}
        <div className="flex gap-x-3 items-center">
          <Link href="/">
            <img src="/logoNew.png" alt="logo" className="w-12 h-12" />
          </Link>
          <Link href="/" className="font-serif font-semibold text-[#001B3C] text-lg">
            LuxVenue
          </Link>
        </div>

        {/* desktop links */}
        <div className="hidden md:flex gap-x-10">
          <Link href="/venues" className={navLinkClass}>Venues</Link>
          <Link href="/about" className={navLinkClass}>About</Link>
          <Link href="/contact" className={navLinkClass}>Contact</Link>
        </div>

        {/* desktop right side */}
        <div className="hidden md:flex items-center gap-x-4">
          {user ? (
            // logged in — show avatar with dropdown
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#001B3C]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#001B3C] text-white flex items-center justify-center text-sm font-semibold">
                    {getInitials(profile?.full_name)}
                  </div>
                )}
                <span className="text-sm font-medium text-[#001B3C]">
                  {profile?.full_name?.split(" ")[0] || "Account"}
                </span>
              </button>

              {/* dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={15} /> Profile
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <form action={logOut}>
                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={15} /> Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            // not logged in — show sign in and get started
            <>
              <Link href="/auth/signin" className={buttonClass}>Sign in</Link>
              <Link href="/auth/signup" className={buttonClass}>Get started</Link>
            </>
          )}
        </div>

        {/* mobile hamburger */}
        <button
          className="md:hidden text-[#001B3C]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#E2E2E2] shadow-md flex flex-col gap-y-4 px-6 py-6 z-50">
          <Link href="/venues" className={navLinkClass} onClick={() => setMenuOpen(false)}>Venues</Link>
          <Link href="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className={navLinkClass} onClick={() => setMenuOpen(false)}>Contact</Link>
          <hr className="border-[#001B3C]/20" />
          {user ? (
            <>
              <Link href="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <form action={logOut}>
                <button className="text-red-500 text-sm font-medium">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className={buttonClass} onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link href="/auth/signup" className={buttonClass} onClick={() => setMenuOpen(false)}>Get started</Link>
            </>
          )}
        </div>
      )}

    </nav>
  )
}