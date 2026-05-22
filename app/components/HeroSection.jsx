"use client"

import { useState } from "react";
import { useRouter } from "next/navigation"
import { Search, Calendar, Users, Sparkles } from "lucide-react"

export default function HeroSection() {
    return(
        <div className="relative">
            <img className="w-full h-[120vh] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs0TZwlcVaA5s-qF4w-NBQYl5BclQlS0oxxxSrDunc4bq_q8AiwTs4DklYK8ton22DHXECTOZqescgcI8YWk27d8FZoVekG78C8jSWTZCYtDRpV_puJ9ELSDO4wneSA_MOaCEj-8Sv2ZKay6DOHhG7eBld-JENmdUR5PJ3Kvv6HBggqEpYzcUwW5OgceoPGTKbkdz4RXv7Z6asNTjzNPvwD-qMcKUb6Q0EMZpyju7vKKgHEMHMC6_XC3NKJtP2sCGcDWqxiCfnOSQ" />
            <div className="font-serif absolute top-90 left-20  h-50 w-190 p-5 backdrop-blur-lg rounded-[10px] bg-white/15">
                <h1 className="text-white text-[20px]">Architectural Precision in Every reservation</h1>

            </div>
        </div>
    )
}