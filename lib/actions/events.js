// lib/actions/events.js
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleChecklistItem(itemId, newState) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("checklist_items")
    .update({
      is_completed: newState,
      completed_at: newState ? new Date().toISOString() : null,
    })
    .eq("id", itemId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function addChecklistItem(eventId, title, dueDate) {
  const supabase = await createClient()

  const { data: item, error } = await supabase
    .from("checklist_items")
    .insert({
      event_id: eventId,
      title,
      due_date: dueDate || null,
      is_completed: false,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  return { item }
}

export async function addGuest(eventId, guestData) {
  const supabase = await createClient()

  const { data: guest, error } = await supabase
    .from("event_guests")
    .insert({
      event_id: eventId,
      name: guestData.name,
      email: guestData.email,
      phone: guestData.phone || null,
      dietary_needs: guestData.dietary_needs || "none",
      rsvp_status: "pending",
    })
    .select()
    .single()

  if (error) return { error: error.message }
  return { guest }
}