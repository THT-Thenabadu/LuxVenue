// app/venues/[id]/page.jsx
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Navbar from "@/components/ui/layout/Navbar"
import Link from "next/link"
import {
  Users, MapPin, Maximize, Star,
  Wifi, Car, Utensils, Mic, ArrowLeft
} from "lucide-react"

// map amenity strings to icons
const amenityIcons = {
  "wifi": Wifi,
  "parking": Car,
  "catering": Utensils,
  "av": Mic,
}

export default async function VenueDetailPage({ params }) {
  const supabase = await createClient()

  // await params first before accessing any property
  const { id } = await params

  const { data: venue, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", id)
    .single()

  if (!venue || error) notFound()

  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles (full_name)
    `)
    .eq("event_id", id)
    .limit(5)

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F7F9FB]">

        {/* back button */}
        <div className="px-6 md:px-12 lg:px-20 pt-6">
          <Link
            href="/venues"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#001B3C] transition-colors"
          >
            <ArrowLeft size={16} /> Back to venues
          </Link>
        </div>

        {/* image gallery */}
        <div className="px-6 md:px-12 lg:px-20 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl overflow-hidden">
            <img
              src={venue.images?.[0] || "https://placehold.co/800x600/001B3C/white?text=LuxVenue"}
              alt={venue.name}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="hidden md:grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={venue.images?.[i] || "https://placehold.co/400x300/001B3C/white?text=LuxVenue"}
                  alt={`${venue.name} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        {/* content */}
        <div className="px-6 md:px-12 lg:px-20 pb-16">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* left — venue info */}
            <div className="flex-1">

              <h1 className="font-serif text-3xl md:text-4xl text-[#001B3C] font-semibold mb-2">
                {venue.name}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {venue.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} /> Up to {venue.capacity} guests
                </span>
                {venue.floor_area && (
                  <span className="flex items-center gap-1">
                    <Maximize size={14} /> {venue.floor_area} m²
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {venue.description}
              </p>

              {/* amenities */}
              {venue.amenities && venue.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-serif text-xl text-[#001B3C] font-semibold mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {venue.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity.toLowerCase()] || Star
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-lg text-sm text-gray-700"
                        >
                          <Icon size={15} className="text-[#1F477B]" />
                          {amenity}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* reviews */}
              {reviews && reviews.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl text-[#001B3C] font-semibold mb-4">
                    Reviews
                  </h2>
                  <div className="flex flex-col gap-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white border border-gray-100 rounded-xl p-5"
                      >
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={13} className="fill-[#001B3C] text-[#001B3C]" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{review.comment}</p>
                        <p className="text-xs text-gray-400 font-medium">
                          {review.is_anonymous ? "Anonymous" : review.profiles?.full_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* right — booking card */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-xl p-6 sticky top-6">

                <div className="mb-5">
                  <span className="text-xs text-gray-400">Starting from</span>
                  <p className="font-serif text-2xl text-[#001B3C] font-semibold">
                    LKR {venue.price_per_day?.toLocaleString()}
                    <span className="text-sm font-normal text-gray-400"> / day</span>
                  </p>
                  {venue.minimum_spend && (
                    <p className="text-xs text-gray-400 mt-1">
                      Minimum spend: LKR {venue.minimum_spend?.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 mb-6 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Capacity</span>
                    <span className="font-medium text-[#001B3C]">
                      Up to {venue.capacity} guests
                    </span>
                  </div>
                  {venue.floor_area && (
                    <div className="flex justify-between">
                      <span>Floor area</span>
                      <span className="font-medium text-[#001B3C]">{venue.floor_area} m²</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Availability</span>
                    <span className={`font-medium ${venue.is_available ? "text-green-600" : "text-red-500"}`}>
                      {venue.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {venue.is_available ? (
                  <Link
                    href={`/venues/${venue.id}/book`}
                    className="w-full block text-center bg-[#001B3C] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-colors"
                  >
                    Book this venue
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg text-sm font-semibold cursor-not-allowed"
                  >
                    Not available
                  </button>
                )}

                <p className="text-xs text-gray-400 text-center mt-3">
                  No payment taken yet. Review and confirm first.
                </p>

              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}