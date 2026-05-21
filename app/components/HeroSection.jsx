"use client"

import { useState } from "react";
import { useRouter } from "next/navigation"
import { Search, Calendar, Users, Sparkles } from "lucide-react"

export default function HeroSection() {
    return(
        <>
            <img className="w-full h-[120vh]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs0TZwlcVaA5s-qF4w-NBQYl5BclQlS0oxxxSrDunc4bq_q8AiwTs4DklYK8ton22DHXECTOZqescgcI8YWk27d8FZoVekG78C8jSWTZCYtDRpV_puJ9ELSDO4wneSA_MOaCEj-8Sv2ZKay6DOHhG7eBld-JENmdUR5PJ3Kvv6HBggqEpYzcUwW5OgceoPGTKbkdz4RXv7Z6asNTjzNPvwD-qMcKUb6Q0EMZpyju7vKKgHEMHMC6_XC3NKJtP2sCGcDWqxiCfnOSQ"></img>
        </>
    )
}