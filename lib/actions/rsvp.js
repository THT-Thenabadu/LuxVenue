// lib/actions/rsvp.js
"use server"

import { createClient } from "@/lib/supabase/server"

export async function submitRSVP({ guestId, rsvpStatus, dietaryNeeds, dietaryNotes }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_guests")
    .update({
      rsvp_status: rsvpStatus,
      dietary_needs: dietaryNeeds,
      dietary_notes: dietaryNotes || null,
    })
    .eq("id", guestId)

  if (error) {
    console.error("RSVP error:", error)
    return { error: error.message }
  }

  return { success: true }
}