// app/venues/page.jsx
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Navbar from "@/components/ui/layout/Navbar"
import VenueFilters from "./_components/VenueFilters"
import { MapPin, Users, ArrowRight } from "lucide-react"

export default async function VenuesPage({ searchParams }) {
  const supabase = await createClient()

  const resolvedSearchParams = await searchParams
const eventType = resolvedSearchParams?.type || ""
const guests = resolvedSearchParams?.guests || ""
const date = resolvedSearchParams?.date || ""

  // build the query
  let query = supabase
    .from("venues")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false })

  // apply guest count filter if provided
  if (guests) {
    query = query.gte("capacity", parseInt(guests))
  }

  const { data: venues, error } = await query

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F7F9FB]">

        {/* page header */}
        <div className="bg-[#001B3C] px-6 md:px-12 lg:px-20 py-12">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-2">
            Browse spaces
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-semibold">
            All Venues
          </h1>
          {(eventType || guests || date) && (
            <p className="text-white/60 text-sm mt-2">
              Filtered results
              {eventType && ` · ${eventType}`}
              {guests && ` · ${guests}+ guests`}
              {date && ` · ${date}`}
            </p>
          )}
        </div>

        <div className="px-6 md:px-12 lg:px-20 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* filters sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <VenueFilters
                currentType={eventType}
                currentGuests={guests}
                currentDate={date}
              />
            </aside>

            {/* venue grid */}
            <div className="flex-1">

              {/* results count */}
              <p className="text-sm text-gray-500 mb-6">
                {venues?.length || 0} venue{venues?.length !== 1 ? "s" : ""} found
              </p>

              {venues && venues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {venues.map((venue) => (
                    <Link
                      key={venue.id}
                      href={`/venues/${venue.id}`}
                      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 group"
                    >
                      {/* venue image */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={venue.images?.[0] || "https://placehold.co/600x400/001B3C/white?text=LuxVenue"}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {!venue.is_available && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Unavailable</span>
                          </div>
                        )}
                      </div>

                      {/* venue info */}
                      <div className="p-5">
                        <h3 className="font-serif text-lg text-[#001B3C] font-semibold mb-1">
                          {venue.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {venue.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users size={13} /> {venue.capacity} guests
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={13} /> {venue.location}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-gray-400">From</span>
                            <p className="text-sm font-semibold text-[#001B3C]">
                              LKR {venue.price_per_day?.toLocaleString()} / day
                            </p>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-medium text-[#1F477B] group-hover:gap-2 transition-all">
                            View venue <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>

                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <MapPin size={40} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-gray-400 mb-2">No venues found</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Try adjusting your filters to see more results.
                  </p>
                  <Link
                    href="/venues"
                    className="text-sm bg-[#001B3C] text-white px-6 py-3 rounded-lg hover:bg-[#1F477B] transition-colors"
                  >
                    Clear filters
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}