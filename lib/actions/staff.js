// lib/actions/staff.js
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"
import { createServiceClient } from "@/lib/supabase/server"

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

export async function sendStaffInvite(email, role, invitedBy) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: staffMember } = await supabase
    .from("staff_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!staffMember || staffMember.role !== "manager") {
    return { error: "Only managers can invite staff" }
  }

  const { data: existingInvite } = await supabase
    .from("staff_invites")
    .select("id")
    .eq("email", email)
    .eq("accepted", false)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (existingInvite) {
    return { error: "An invite has already been sent to this email" }
  }

  const { data: invite, error: inviteError } = await supabase
    .from("staff_invites")
    .insert({
      email,
      role,
      invited_by: invitedBy,
    })
    .select()
    .single()

  if (inviteError) return { error: inviteError.message }

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/staff-signup?token=${invite.token}`

  console.log("Invite URL:", inviteUrl)

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error: emailError } = await resend.emails.send({
    from: "LuxVenue <noreply@yourdomain.com>",
    to: email,
    subject: "You have been invited to join LuxVenue staff",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; color: #001B3C; margin-bottom: 8px;">
          You have been invited to LuxVenue
        </h1>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          You have been invited to join the LuxVenue hotel team as a <strong>${role}</strong>.
          Click the button below to create your account.
        </p>
        
          href="${inviteUrl}"
          style="display: inline-block; background: #001B3C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;"
        >
          Accept invitation
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
          This invite expires in 7 days. If you did not expect this email you can safely ignore it.
        </p>
      </div>
    `
  })

  if (emailError) {
    console.error("Email error:", emailError)
  }

  return { success: true, inviteUrl }
}

export async function validateInviteToken(token) {
  const supabase = await createClient()

  const { data: invite, error } = await supabase
    .from("staff_invites")
    .select("*")
    .eq("token", token)
    .eq("accepted", false)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (error || !invite) return { error: "Invalid or expired invite" }
  return { invite }
}

export async function acceptStaffInvite(token, fullName, password) {
  const supabase = await createClient()

  const { data: invite, error: inviteError } = await supabase
    .from("staff_invites")
    .select("*")
    .eq("token", token)
    .eq("accepted", false)
    .gt("expires_at", new Date().toISOString())
    .single()

  console.log("1. Invite found:", invite)
  console.log("1. Invite error:", inviteError)

  if (inviteError || !invite) {
    return { error: "Invalid or expired invite" }
  }

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: invite.email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })

  console.log("2. Auth data:", authData)
  console.log("2. SignUp error:", signUpError)

  if (signUpError) return { error: signUpError.message }

  const userId = authData.user?.id
  console.log("3. User ID:", userId)

  if (!userId) return { error: "Failed to create account" }

  const serviceClient = createServiceClient()

  const { error: staffError } = await serviceClient
    .from("staff_members")
    .insert({
      user_id: userId,
      role: invite.role,
      is_active: true,
      invited_by: invite.invited_by,
    })

  console.log("4. Staff insert error:", staffError)

  if (staffError) return { error: staffError.message }

  await serviceClient
    .from("staff_invites")
    .update({
      accepted: true,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invite.id)

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: invite.email,
    password,
  })

  console.log("5. SignIn error:", signInError)

  if (signInError) return { error: signInError.message }

  return { success: true }
}