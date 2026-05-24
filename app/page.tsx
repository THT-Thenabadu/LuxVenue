// app/page.jsx
import Navbar from "../components/ui/layout/Navbar"
import Hero from "../components/ui/layout/HeroSection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star, Share2, Globe, Shield, CreditCard, CheckCircle, Send } from "lucide-react"
import "./globals.css"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// venue data
const venues = [
  {
    id: 1,
    name: "The Meridian Atrium",
    description: "Best place for conferences",
    image: "https://tse1.mm.bing.net/th/id/OIP.xNKp3Hb9W75uqTPenkijpwHaEJ?w=626&h=351&rs=1&pid=ImgDetMain&o=7&rm=3",
    badge: "Featured"
  },
  {
    id: 2,
    name: "The Grand Ballroom",
    description: "Perfect for weddings and galas",
    image: "https://tse1.mm.bing.net/th/id/OIP.xNKp3Hb9W75uqTPenkijpwHaEJ?w=626&h=351&rs=1&pid=ImgDetMain&o=7&rm=3",
    badge: "Popular"
  },
  {
    id: 3,
    name: "The Rooftop Terrace",
    description: "Stunning views for private events",
    image: "https://tse1.mm.bing.net/th/id/OIP.xNKp3Hb9W75uqTPenkijpwHaEJ?w=626&h=351&rs=1&pid=ImgDetMain&o=7&rm=3",
    badge: "New"
  },
]

// event type data
const eventTypes = [
  {
    id: 1,
    label: "Weddings",
    image: "https://th.bing.com/th/id/OIP.E7eQopMalaFMZ8qz18ZS1wHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 2,
    label: "Corporate",
    image: "https://th.bing.com/th/id/OIP.E7eQopMalaFMZ8qz18ZS1wHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 3,
    label: "Galas",
    image: "https://th.bing.com/th/id/OIP.E7eQopMalaFMZ8qz18ZS1wHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 4,
    label: "Conferences",
    image: "https://th.bing.com/th/id/OIP.E7eQopMalaFMZ8qz18ZS1wHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
]

// testimonial data
const testimonials = [
  {
    id: 1,
    quote: "The level of architectural precision in their venue layouts made our corporate summit seamless. Truly a luxury service for discerning professionals.",
    name: "Eleanor Dupont",
    title: "Global Logistics Director",
    initials: "ED",
    rating: 5
  },
  {
    id: 2,
    quote: "From the first inquiry to the final champagne toast, LuxVenue provided an atmosphere of absolute calm and refined luxury for our wedding.",
    name: "Marcus Jameson",
    title: "Private Client",
    initials: "MJ",
    rating: 5
  },
  {
    id: 3,
    quote: "The venues are curated with an artist's eye. Each space tells a story of elegance and modern sophistication. Unmatched in the industry.",
    name: "Sarah Liao",
    title: "Event Strategist",
    initials: "SL",
    rating: 5
  },
]

// trust badges
const trustBadges = [
  { icon: <CheckCircle size={20} />, label: "Licensed Operator" },
  { icon: <Shield size={20} />, label: "Secure Payment" },
  { icon: <CreditCard size={20} />, label: "Accessibility Compliant" },
]

// footer navigation
const footerNav = {
  navigation: ["Destinations", "Event Types", "Concierge"],
  information: ["Privacy Policy", "Terms of Service", "Press Room", "Sustainability", "Careers"],
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      {/* ── Section 2 — Featured Venues ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-16 flex flex-col gap-8">

        {/* header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#1F477B] uppercase tracking-widest mb-2">
              Curated spaces
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-black">
              Featured Venue Showcase
            </h2>
          </div>
          <button className="flex items-center gap-2 text-sm text-[#001B3C] font-semibold hover:underline self-start md:self-auto">
            View all venues <ExternalLink size={15} />
          </button>
        </div>

        {/* venue cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} className="relative w-full pt-0 overflow-hidden">
              <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
              <img
                src={venue.image}
                alt={venue.name}
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
              />
              <CardHeader>
                <CardAction>
                  <Badge variant="secondary">{venue.badge}</Badge>
                </CardAction>
                <CardTitle>{venue.name}</CardTitle>
                <CardDescription>{venue.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full bg-[#001B3C] hover:bg-[#1F477B] transition-colors duration-300">
                  View Venue
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

      </section>

      {/* ── Section 3 — Tailored Experiences ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-16 bg-[#F2F2F2] flex flex-col items-center gap-10">

        <div className="text-center">
          <p className="text-sm font-semibold text-[#1F477B] uppercase tracking-widest mb-2">
            Every occasion covered
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-black">
            Tailored Experiences
          </h2>
        </div>

        {/* event type image grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
          {eventTypes.map((type) => (
            <div key={type.id} className="relative group overflow-hidden rounded-xl cursor-pointer">
              <img
                src={type.image}
                alt={type.label}
                className="w-full h-40 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* overlay */}
              <div className="absolute inset-0 bg-[#001B3C]/50 group-hover:bg-[#001B3C]/30 transition-colors duration-300 rounded-xl" />
              {/* label */}
              <span className="absolute bottom-3 left-3 text-white font-serif text-lg font-semibold">
                {type.label}
              </span>
            </div>
          ))}
        </div>

      </section>

      {/* ── Section 4 — Testimonials ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-16 bg-white flex flex-col items-center gap-10">

        <div className="text-center">
          <p className="text-sm font-semibold text-[#1F477B] uppercase tracking-widest mb-2">
            What our clients say
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-black">
            Voices of Excellence
          </h2>
        </div>

        {/* testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm">

              {/* stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-[#001B3C] text-[#001B3C]" />
                ))}
              </div>

              {/* quote */}
              <p className="text-gray-600 text-sm leading-relaxed">
                "{t.quote}"
              </p>

              {/* author */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-9 h-9 rounded-full bg-[#001B3C] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#001B3C]">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.title}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* trust badges */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16 mt-4">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="text-[#001B3C]">{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </div>

      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full bg-[#001B3C] px-6 md:px-12 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-serif text-white text-lg md:text-xl text-center md:text-left">
          Not sure where to start? Talk to our coordinator
        </p>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 border border-white text-white text-sm rounded-lg hover:bg-white hover:text-[#001B3C] transition-colors duration-300">
            Email Us
          </button>
          <button className="px-6 py-2 border border-white text-white text-sm rounded-lg hover:bg-white hover:text-[#001B3C] transition-colors duration-300">
            Call Now
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="w-full bg-[#0A1628] text-white px-6 md:px-12 lg:px-20 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* brand */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xl font-semibold">LuxVenue</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Architectural precision in every reservation. Defining the standard for high-end event space curation.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <Share2 size={18} className="cursor-pointer hover:text-white transition-colors" />
              <Globe size={18} className="cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>

          {/* navigation */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              {footerNav.navigation.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* information */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Information
            </h4>
            <ul className="flex flex-col gap-3">
              {footerNav.information.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Newsletter
            </h4>
            <p className="text-sm text-gray-400">
              Subscribe for exclusive venue openings.
            </p>
            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
              <button className="bg-[#1F477B] hover:bg-[#2a5a9e] transition-colors px-4 py-2">
                <Send size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* bottom bar */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2024 LuxVenue. Architectural precision in every reservation.
          </p>
        </div>

      </footer>

    </>
  )
}