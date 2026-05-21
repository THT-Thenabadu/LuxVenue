"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X} from "lucide-react"

export default function Navbar() {
  

    return(
        <nav className="bg-[#E2E2E2] text-black flex justify-around items-center px-6 h-20 gap-x-10 w-full shadow-md">
                
                <div className="w-50 flex gap-x-5 items-center">
                <Link href="/">
                <img src="/logoNew.png" alt="logo" className="w-15 h-15"/>
                </Link>
                <Link href="/">
                LuxVenue
                </Link>
                </div>

                <div className="w-100  flex gap-x-25">
                    <Link href="" 
                            className="font-serif text-[#001B3C] 
                                        text-lg
                                        relative after:absolute 
                                        after:bottom-0 after:left-0 
                                        after:h-[2px] after:w-full 
                                        after:origin-center 
                                        after:scale-x-0 
                                        after:bg-[#1F477B] 
                                        after:transition-transform 
                                        after:duration-300 
                                        after:ease-out 
                                        hover:after:scale-x-100">
                             Venue
                    </Link>
                    <Link href=""
                    className="font-serif text-[#001B3C] 
                                        text-lg
                                        relative after:absolute 
                                        after:bottom-0 after:left-0 
                                        after:h-[2px] after:w-full 
                                        after:origin-center 
                                        after:scale-x-0 
                                        after:bg-[#1F477B] 
                                        after:transition-transform 
                                        after:duration-300 
                                        after:ease-out 
                                        hover:after:scale-x-100"
                    >About</Link>


                    <Link href=""
                    className="font-serif text-[#001B3C] 
                                        text-lg
                                        relative after:absolute 
                                        after:bottom-0 after:left-0 
                                        after:h-[2px] after:w-full 
                                        after:origin-center 
                                        after:scale-x-0 
                                        after:bg-[#1F477B] 
                                        after:transition-transform 
                                        after:duration-300 
                                        after:ease-out 
                                        hover:after:scale-x-100"
                    >Contact</Link>
                </div>

                <div className="relative right-0 flex gap-x-5 items-center">
                    <Link href="/auth/login" className="font-serif w-20 h-9  flex justify-center rounded-xl bg-[#001B3C] text-white p-1
                                shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md 
                    ">Sign in</Link>
                    <Link href="/auth/signup" className="font-serif w-25 h-9  flex justify-center rounded-xl bg-[#001B3C] text-white p-1
                                shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md  
                    ">Get started</Link>
                </div>

                

        </nav>
    
    )


}