// app/(staff)/staff/vendors/page.jsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AddVendorForm from "./_components/AddVendorForm"
import { Truck, Mail, Phone } from "lucide-react"

const categoryColors = {
  florist: "bg-pink-100 text-pink-700",
  av: "bg-blue-100 text-blue-700",
  catering: "bg-orange-100 text-orange-700",
  photography: "bg-purple-100 text-purple-700",
  other: "bg-gray-100 text-gray-600",
}

export default async function VendorsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/signin")

  const { data: staffMember } = await supabase
    .from("staff_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!staffMember) redirect("/dashboard")

  const { data: vendors } = await supabase
    .from("vendors")
    .select("*")
    .order("name", { ascending: true })

  return (
    <div className="p-6 md:p-10">

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#001B3C] font-semibold mb-1">
          Vendors
        </h1>
        <p className="text-gray-500 text-sm">
          Manage and assign third party suppliers to events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* add vendor form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold mb-5">
              Add vendor
            </h2>
            <AddVendorForm />
          </div>
        </div>

        {/* vendors list */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-serif text-lg text-[#001B3C] font-semibold mb-5">
              All vendors ({vendors?.length || 0})
            </h2>

            {vendors && vendors.length > 0 ? (
              <div className="space-y-3">
                {vendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex items-center gap-4 p-4 bg-[#F7F9FB] rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#001B3C] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {vendor.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-[#001B3C] truncate">
                          {vendor.name}
                        </p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${categoryColors[vendor.category]}`}>
                          {vendor.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        {vendor.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={11} /> {vendor.email}
                          </span>
                        )}
                        {vendor.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={11} /> {vendor.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Truck size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No vendors yet</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}