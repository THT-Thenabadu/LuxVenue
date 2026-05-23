"use client"

import { useState } from "react";
import { useRouter } from "next/navigation"
import { Search, Calendar, Users, Sparkles, MoveRight } from "lucide-react"
import React from "react";




export default function HeroSection() {
    



    return(
        <div className="relative">
            <img className="w-full h-[120vh] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs0TZwlcVaA5s-qF4w-NBQYl5BclQlS0oxxxSrDunc4bq_q8AiwTs4DklYK8ton22DHXECTOZqescgcI8YWk27d8FZoVekG78C8jSWTZCYtDRpV_puJ9ELSDO4wneSA_MOaCEj-8Sv2ZKay6DOHhG7eBld-JENmdUR5PJ3Kvv6HBggqEpYzcUwW5OgceoPGTKbkdz4RXv7Z6asNTjzNPvwD-qMcKUb6Q0EMZpyju7vKKgHEMHMC6_XC3NKJtP2sCGcDWqxiCfnOSQ" />
            <div className="font-serif absolute top-90 left-20  h-70 w-190 p-5 backdrop-blur-lg rounded-[10px] bg-white/15">
                <h1 className="text-white text-[50px]">Architectural Precision in Every reservation</h1>
                <button className="font-serif w-50 h-10  justify-center rounded-xl bg-[#001B3C] text-white p-1
                                shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md flex gap-x-2 items-center relative top-[15px] ">
                    Plan your event <MoveRight />
                </button>

                     <div className="w-[92vw] h-30 bg-white relative top-50 right-10 flex justify-between items-top p-3 rounded-sm ">
                        <div className="w-60   h-5 relative left-5">
                            <label className="">Date picker</label>

                            
                          


                        </div>
                        <div className="w-20 h-5">
                            <label>
                                Event Type
                            </label>

                            
                           
                        </div>
                        <div className="w-25 h-5">
                            <label>
                                Guest count
                            </label>
                        </div>
                        <button>
                            Click
                        </button>
                    </div>

            </div>
           
        </div>
    )
    
}