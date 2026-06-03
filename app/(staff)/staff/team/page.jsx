// app/(staff)/staff/team/page.jsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import InviteForm from "./_components/InviteForm"
import { Users, Mail, Clock, CheckCircle } from "lucide-react"

export default async function StaffTeamPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/signin")

  // only managers can access this page
  const { data: staffMember } = await supabase
    .from("staff_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!staffMember || staffMember.role !== "manager") redirect("/staff/dashboard")

  // fetch all staff members
  const { data: team } = await supabase
    .from("staff_members")
    .select(`
      *,
      profiles (full_name, email, avatar_url)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // fetch all pending invites
  const { data: invites } = await supabase
    .from("staff_invites")
    .select("*")
    .eq("accepted", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 md:p-10">

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#001B3C] font-semibold mb-1">
          Team management
        </h1>
        <p className="text-gray-500 text-sm">
          Invite and manage hotel staff members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* invite form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold mb-5">
              Invite a team member
            </h2>
            <InviteForm invitedBy={user.id} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">

          {/* current team */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold mb-5">
              Current team
            </h2>

            {team && team.length > 0 ? (
              <div className="space-y-3">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 bg-[#F7F9FB] rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#001B3C] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {member.profiles?.full_name?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#001B3C] truncate">
                        {member.profiles?.full_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {member.profiles?.email}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                      member.role === "manager"
                        ? "bg-[#001B3C] text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No team members yet</p>
              </div>
            )}
          </div>

          {/* pending invites */}
          {invites && invites.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="font-serif text-lg text-[#001B3C] font-semibold mb-5">
                Pending invites
              </h2>
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl"
                  >
                    <Mail size={18} className="text-yellow-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#001B3C] truncate">
                        {invite.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Invited as {invite.role} · Expires {new Date(invite.expires_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1">
                      <Clock size={10} /> Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}