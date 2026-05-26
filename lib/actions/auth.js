// lib/actions/auth.js
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// ── SIGN UP ──────────────────────────────────────────
export async function signUp(formData) {

  const supabase = await createClient()

  const firstName = formData.get("firstName")
  const lastName = formData.get("lastName")
  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")
  const full_name = `${firstName} ${lastName}`

  // basic validation
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  // create the user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,  // this gets passed to your handle_new_user trigger
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // redirect to a confirmation page
  redirect("/auth/confirm")
}

// ── LOG IN ───────────────────────────────────────────
export async function logIn(formData) {

  const supabase = await createClient()

  const email = formData.get("email")
  const password = formData.get("password")

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: "Incorrect email or password" }
    // notice we never say WHICH field is wrong — security best practice
  }

  // redirect to dashboard on success
  redirect("/dashboard")
}

// ── LOG OUT ──────────────────────────────────────────
export async function logOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}