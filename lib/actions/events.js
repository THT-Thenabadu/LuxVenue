// lib/actions/events.js
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sendRSVPInvite } from "@/lib/email"

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

  // get event and venue details for the email
  const { data: event } = await supabase
    .from("events")
    .select(`
      name,
      start_date,
      venues (name),
      profiles!events_organiser_id_fkey (full_name)
    `)
    .eq("id", eventId)
    .single()

  // send RSVP invite email
  if (event) {
    await sendRSVPInvite({
      to: guestData.email,
      guestName: guestData.name,
      eventName: event.name,
      hostName: event.profiles?.full_name || "Your host",
      eventDate: new Date(event.start_date).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
      }),
      venueName: event.venues?.name || "the venue",
      token: guest.qr_token,
    })
  }

  return { guest }
}

export async function sendMessage(eventId, content) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      event_id: eventId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select()
    .single()
  if (error) return { error: error.message }
  return { message }
}

export async function addRunOfShowItem(eventId, itemData) {
  const supabase = await createClient()
  const { data: item, error } = await supabase
    .from("run_of_show")
    .insert({
      event_id: eventId,
      time: itemData.time,
      title: itemData.title,
      description: itemData.description || null,
      responsible: itemData.responsible || null,
      order_index: itemData.order_index || 0,
    })
    .select()
    .single()
  if (error) return { error: error.message }
  return { item }
}

export async function deleteRunOfShowItem(itemId) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("run_of_show")
    .delete()
    .eq("id", itemId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function submitReview({ eventId, rating, comment, isAnonymous }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // check event belongs to this user and is completed
  const { data: event } = await supabase
    .from("events")
    .select("status, organiser_id")
    .eq("id", eventId)
    .single()

  if (!event) return { error: "Event not found" }
  if (event.organiser_id !== user.id) return { error: "Not authorized" }
  if (event.status !== "completed") return { error: "Event must be completed before reviewing" }

  // check if already reviewed
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("event_id", eventId)
    .eq("reviewer_id", user.id)
    .single()

  if (existing) return { error: "You have already reviewed this event" }

  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      event_id: eventId,
      reviewer_id: user.id,
      rating,
      comment: comment || null,
      is_anonymous: isAnonymous,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  return { review }
}