
"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { ARDrillView } from "@/components/ar-drill-view"
import { Badge } from "@/components/ui/badge"

export default function OnboardingTutorialPage() {
  const { sport } = useParams()
  const router = useRouter()
  const [completeCount, setCompleteCount] = useState(0)

  const handleHit = () => {
    setCompleteCount(c => c + 1)
    if (completeCount + 1 >= 3) {
      setTimeout(() => {
        router.push(`/onboarding/${sport}/baseline`)
      }, 1000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <header className="absolute top-12 left-1/2 -translate-x-1/2 z-50 text-center space-y-2 pointer-events-none">
        <Badge className="bg-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-4">Tutorial: Hand Neutralization</Badge>
        <h2 className="text-white text-4xl font-headline font-bold tracking-tighter">Neutralize 3 Targets.</h2>
        <p className="text-white/40 text-sm font-medium">Perform a fast hand swipe over the virtual stimuli.</p>
        <div className="flex gap-2 justify-center pt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={cn("w-3 h-3 rounded-full border border-white/20 transition-all", i <= completeCount ? "bg-primary border-primary scale-125 shadow-[0_0_15px_rgba(38,128,217,0.8)]" : "bg-white/5")} />
          ))}
        </div>
      </header>

      <ARDrillView 
        sport={sport as string} 
        drillName="Kinetic Induction" 
        onComplete={() => {}} // Controlled by handleHit internally or simpler:
        // Tutorial version usually has different constraints, but we'll use the main view
      />
      
      {/* Overlay specific to tutorial if needed */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 glass-dark px-10 py-6 rounded-full border-white/10 text-center animate-pulse pointer-events-none">
        <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Coach: "Keep your eyes on the center, use peripheral vision."</p>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
