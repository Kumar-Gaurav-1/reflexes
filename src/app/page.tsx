
"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Zap, BrainCircuit, ChevronRight, Play, ArrowRight, Activity, Timer } from 'lucide-react'
import { PlaceHolderImagesMap } from '@/lib/placeholder-images'
import { cn } from '@/lib/utils'

const sports = [
  { id: "cricket", title: "Cricket", who: "Batsmen & Keepers", trains: "Anticipatory Focus", improvement: "15ms", imgId: "cricket-thumbnail", layer: "Layer 3" },
  { id: "soccer", title: "Football", who: "Goalkeepers", trains: "Spatial Reactions", improvement: "22ms", imgId: "soccer-thumbnail", layer: "Layer 1" },
  { id: "tennis", title: "Tennis", who: "Return Specialists", trains: "Choice Reaction", improvement: "12ms", imgId: "tennis-thumbnail", layer: "Layer 2" },
  { id: "basketball", title: "Basketball", who: "Point Guards", trains: "Peripheral Vision", improvement: "18ms", imgId: "hero-pro", layer: "Layer 2" },
  { id: "boxing", title: "Boxing", who: "Counter Punchers", trains: "Fatigue Resistance", improvement: "30ms", imgId: "boxing-thumbnail", layer: "Layer 4" },
  { id: "general", title: "General Reflexes", who: "All Athletes", trains: "Neural Baseline", improvement: "25ms", imgId: "circuit-main", layer: "Foundation" },
]

export default function LandingPage() {
  const getImg = (id: string) => PlaceHolderImagesMap[id]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Target className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-headline font-bold uppercase tracking-tight">REFLEXES</span>
          </div>
          <Button variant="ghost" asChild className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <Link href="/dashboard">Direct to Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Cinematic Hero */}
        <section className="relative pt-20 pb-20 px-6 overflow-hidden bg-black text-white">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <Zap className="w-3 h-3" />
              <span>Est. time to first drill: 90 seconds</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-headline font-bold leading-[0.8] tracking-tighter max-w-4xl">
              Professional <br />
              Reflex Labs.
            </h1>
            <p className="text-xl text-white/60 max-w-xl font-medium">
              Elite AR cognitive training on your smartphone. <br className="hidden md:block" />
              No login required to start.
            </p>
            <Button size="lg" className="h-20 px-16 rounded-full text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 group" asChild>
              <Link href="#sports">
                Start Training
                <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <div className="absolute inset-0 opacity-40 pointer-events-none">
             <div className="absolute right-[-10%] top-[-10%] w-1/2 aspect-square bg-primary/20 rounded-full blur-[120px]" />
             <div className="absolute left-[-5%] bottom-[-5%] w-1/3 aspect-square bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
        </section>

        {/* Sport Selection (The Hub) */}
        <section id="sports" className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Onboarding Journey 1/5</p>
              <h2 className="text-6xl font-headline font-bold tracking-tighter">Choose Your Discipline.</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sports.map((sport) => {
                const img = getImg(sport.imgId)
                return (
                  <Link key={sport.id} href={`/onboarding/${sport.id}`} className="group">
                    <Card className="relative h-[480px] overflow-hidden rounded-[3.5rem] border-none group-hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                      <Image 
                        src={img?.imageUrl || ""} 
                        alt={sport.title} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        data-ai-hint={img?.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent p-10 flex flex-col justify-end text-white">
                        <div className="space-y-6">
                          <div className="flex justify-between items-start">
                            <Badge className="bg-white/10 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.2em] border-none py-1.5 px-4 rounded-full">
                              {sport.layer}
                            </Badge>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">+{sport.improvement} avg. gain</span>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-4xl font-headline font-bold tracking-tight">{sport.title}</h3>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Trains: {sport.trains}</p>
                          </div>
                          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white/40" />
                              </div>
                              <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">For {sport.who}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t glass text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">© 2025 Reflexes AR Labs. Professional Grade Training.</p>
      </footer>
    </div>
  )
}
