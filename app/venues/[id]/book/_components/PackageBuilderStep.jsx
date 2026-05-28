// app/venues/[id]/book/_components/PackageBuilderStep.jsx
"use client"

import { useState } from "react"
import { Plus, Minus, Check } from "lucide-react"

const categoryLabels = {
  catering: "Catering",
  av: "Audio & Visual",
  decor: "Décor",
  accommodation: "Accommodation",
  other: "Other"
}

const categoryColors = {
  catering: "bg-orange-50 border-orange-200 text-orange-700",
  av: "bg-blue-50 border-blue-200 text-blue-700",
  decor: "bg-pink-50 border-pink-200 text-pink-700",
  accommodation: "bg-green-50 border-green-200 text-green-700",
  other: "bg-gray-50 border-gray-200 text-gray-700",
}

export default function PackageBuilderStep({ packages, initialSelected, onSubmit, onBack }) {
  const [selected, setSelected] = useState(initialSelected || [])

  // group packages by category
  const grouped = packages.reduce((acc, pkg) => {
    if (!acc[pkg.category]) acc[pkg.category] = []
    acc[pkg.category].push(pkg)
    return acc
  }, {})

  function isSelected(pkgId) {
    return selected.some(s => s.id === pkgId)
  }

  function togglePackage(pkg) {
    if (isSelected(pkg.id)) {
      setSelected(prev => prev.filter(s => s.id !== pkg.id))
    } else {
      setSelected(prev => [...prev, { ...pkg, quantity: 1 }])
    }
  }

  const subtotal = selected.reduce((sum, pkg) => sum + pkg.price * (pkg.quantity || 1), 0)

  return (
    <div className="space-y-6">

      {/* packages */}
      <div className="bg-white border border-gray-100 rounded-xl p-8">
        <h2 className="font-serif text-2xl text-[#001B3C] font-semibold mb-2">
          Build your package
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Select the add-ons you need. Everything is optional.
        </p>

        {packages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm">
              No packages available at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, pkgs]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                  {categoryLabels[category] || category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pkgs.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => togglePackage(pkg)}
                      className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                        isSelected(pkg.id)
                          ? "border-[#001B3C] bg-[#001B3C]/5"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[pkg.category]}`}>
                              {categoryLabels[pkg.category]}
                            </span>
                          </div>
                          <h4 className="font-semibold text-[#001B3C] text-sm">
                            {pkg.name}
                          </h4>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${
                          isSelected(pkg.id)
                            ? "bg-[#001B3C] border-[#001B3C]"
                            : "border-gray-300"
                        }`}>
                          {isSelected(pkg.id) && <Check size={12} className="text-white" />}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{pkg.description}</p>
                      <p className="text-sm font-semibold text-[#001B3C]">
                        LKR {pkg.price?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* selected summary */}
      {selected.length > 0 && (
        <div className="bg-[#001B3C] rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-3 text-sm">Selected packages</h3>
          <div className="space-y-2 mb-4">
            {selected.map(pkg => (
              <div key={pkg.id} className="flex justify-between text-sm">
                <span className="text-white/80">{pkg.name}</span>
                <span>LKR {pkg.price?.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/20 pt-3 flex justify-between font-semibold">
            <span>Packages subtotal</span>
            <span>LKR {subtotal.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* navigation */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-200 text-gray-600 py-4 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => onSubmit(selected)}
          className="flex-1 bg-[#001B3C] text-white py-4 rounded-lg text-sm font-semibold hover:bg-[#1F477B] transition-colors"
        >
          Review booking →
        </button>
      </div>

    </div>
  )
}