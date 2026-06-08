// app/(staff)/layout.jsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logOut } from "@/lib/actions/auth"
import {
  LayoutDashboard,
  Calendar,
  Building2,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  Truck,
} from "lucide-react"

const navItems = [
  { href: "/staff/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/staff/events", icon: Calendar, label: "All bookings" },
  { href: "/staff/vendors", icon: Truck, label: "Vendors" },
  { href: "/staff/team", icon: Users, label: "Team" },
  { href: "/staff/settings", icon: Settings, label: "Settings" },
]

export default async function StaffLayout({ children }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/signin")

  // check if user is actually a staff member
  const { data: staffMember } = await supabase
    .from("staff_members")
    .select("role, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  // if not staff redirect to planner dashboard
  if (!staffMember) redirect("/dashboard")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen flex bg-[#F7F9FB]">

      {/* sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col fixed h-full">

        {/* logo + role badge */}
        <div className="px-6 py-6 border-b border-gray-100">
          <Link href="/staff/dashboard" className="font-serif text-[#001B3C] text-xl font-semibold">
            LuxVenue
          </Link>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-[#001B3C]/10 text-[#001B3C] text-xs font-semibold px-2.5 py-1 rounded-full">
            <ShieldCheck size={11} />
            {staffMember.role === "manager" ? "Manager" : "Coordinator"}
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:text-[#001B3C] hover:bg-[#001B3C]/5 transition-all duration-200 text-sm font-medium"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* user + logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#001B3C] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {profile?.full_name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#001B3C] text-sm font-medium truncate">
                {profile?.full_name || "Staff"}
              </p>
              <p className="text-gray-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <form action={logOut}>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 text-sm font-medium">
              <LogOut size={18} />
              Sign out
            </button>
          </form>
        </div>

      </aside>

      {/* main content */}
      <main className="flex-1 md:ml-64">
        {children}
      </main>

    </div>
  )
}