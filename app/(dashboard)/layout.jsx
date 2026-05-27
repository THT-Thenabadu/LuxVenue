// app/(dashboard)/layout.jsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logOut } from "@/lib/actions/auth"
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  MessageSquare,
  CheckSquare,
  LogOut,
  Building2
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/events", icon: Calendar, label: "My Events" },
  { href: "/dashboard/guests", icon: Users, label: "Guests" },
  { href: "/dashboard/payments", icon: CreditCard, label: "Payments" },
  { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
  { href: "/dashboard/checklist", icon: CheckSquare, label: "Checklist" },
]

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()

  // get the current user
  const { data: { user } } = await supabase.auth.getUser()

  // if somehow they got here without being logged in send them to login
  if (!user) redirect("/auth/login")

  // get their profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen flex bg-[#F7F9FB]">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 bg-[#001B3C] flex-col fixed h-full">

        {/* logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="font-serif text-white text-xl font-semibold">
            LuxVenue
          </Link>
        </div>

        {/* nav links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* user profile + logout at bottom */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {profile?.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-white/50 text-xs truncate">
                {user.email}
              </p>
            </div>
          </div>
          <form action={logOut}>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium">
              <LogOut size={18} />
              Sign out
            </button>
          </form>
        </div>

      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-64">
        {children}
      </main>

    </div>
  )
}