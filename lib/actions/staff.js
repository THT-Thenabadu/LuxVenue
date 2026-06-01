// lib/actions/staff.js
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateEventStatus(eventId, newStatus) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: staffMember } = await supabase
    .from("staff_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!staffMember) return { error: "Not authorized" }

  const { error } = await supabase
    .from("events")
    .update({ status: newStatus })
    .eq("id", eventId)

  if (error) return { error: error.message }

  revalidatePath(`/staff/events/${eventId}`)
  return { success: true }
}