import Image from "next/image";
import Navbar from "../components/ui/layout/Navbar"
import Hero from "../components/ui/layout/HeroSection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

//landing page

export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <div className="w-[100vw] h-[100vh] p-10 flex flex-col">
      
      <h1>Curated spaces</h1>
      <h1 className="text-black text-[50px] ">Featured Venue Showcase</h1>

      <button
      className="relative left-[80vw] bottom-0 flex items-center justify center  w-30 h-25"
      >
        view all venues <ExternalLink size={15} />
      </button>
      
    
    
    <div className="w-[95vw] h-[75vh] flex justify-center items-center">


    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://tse1.mm.bing.net/th/id/OIP.xNKp3Hb9W75uqTPenkijpwHaEJ?w=626&h=351&rs=1&pid=ImgDetMain&o=7&rm=3"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>The Meridian Atrium</CardTitle>
        <CardDescription>
          Best place for conferences 
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>

    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://tse1.mm.bing.net/th/id/OIP.xNKp3Hb9W75uqTPenkijpwHaEJ?w=626&h=351&rs=1&pid=ImgDetMain&o=7&rm=3"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>The Meridian Atrium</CardTitle>
        <CardDescription>
          Best place for conferences 
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>


    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://tse1.mm.bing.net/th/id/OIP.xNKp3Hb9W75uqTPenkijpwHaEJ?w=626&h=351&rs=1&pid=ImgDetMain&o=7&rm=3"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>The Meridian Atrium</CardTitle>
        <CardDescription>
          Best place for conferences 
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>



    </div>
    </div>
    </>
  );
}
