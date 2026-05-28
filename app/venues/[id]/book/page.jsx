// app/venues/[id]/book/page.jsx
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import BookingFlow from "./_components/BookingFlow"
import Navbar from "@/components/ui/layout/Navbar"

export default async function BookingPage({ params }) {
  const supabase = await createClient()

  const { id } = await params

  // check user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/signin")

  // get the venue
  const { data: venue } = await supabase
    .from("venues")
    .select("*")
    .eq("id", id)
    .single()

  if (!venue) notFound()

  // get available packages
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("is_available", true)
    .order("category")

  return (
    <>
      <Navbar />
      <BookingFlow
        venue={venue}
        packages={packages || []}
        userId={user.id}
      />
    </>
  )
}