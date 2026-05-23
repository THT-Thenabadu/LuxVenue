"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

// reusable class for nav links so you don't repeat yourself
const navLinkClass = "font-serif text-[#001B3C] text-base relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-[#1F477B] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"

const buttonClass = "font-serif flex justify-center items-center rounded-xl bg-[#001B3C] text-white px-4 py-2 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-[#E2E2E2] text-black px-6 h-20 w-full shadow-md relative">
      
      {/* main row */}
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

        {/* desktop links — hidden on mobile, visible from md up */}
        <div className="hidden md:flex gap-x-10">
          <Link href="/venues" className={navLinkClass}>Venues</Link>
          <Link href="/about" className={navLinkClass}>About</Link>
          <Link href="/contact" className={navLinkClass}>Contact</Link>
        </div>

        {/* desktop auth buttons — hidden on mobile */}
        <div className="hidden md:flex gap-x-4 items-center">
          <Link href="/auth/login" className={buttonClass}>Sign in</Link>
          <Link href="/auth/signup" className={buttonClass}>Get started</Link>
        </div>

        {/* hamburger — visible on mobile only */}
        <button
          className="md:hidden text-[#001B3C]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* mobile menu — drops down when hamburger is clicked */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#E2E2E2] shadow-md flex flex-col gap-y-4 px-6 py-6 z-50">
          <Link href="/venues" className={navLinkClass} onClick={() => setMenuOpen(false)}>Venues</Link>
          <Link href="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className={navLinkClass} onClick={() => setMenuOpen(false)}>Contact</Link>
          <hr className="border-[#001B3C]/20" />
          <Link href="/auth/login" className={buttonClass} onClick={() => setMenuOpen(false)}>Sign in</Link>
          <Link href="/auth/signup" className={buttonClass} onClick={() => setMenuOpen(false)}>Get started</Link>
        </div>
      )}

    </nav>
  )
}