"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, ChevronRight, Zap, BrainCircuit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { PlaceHolderImages, PlaceHolderImagesMap } from "@/lib/placeholder-images"

const categories = [
  { id: 'all', label: 'All Domains' },
  { id: 'precision', label: 'Precision' },
  { id: 'velocity', label: 'Velocity' },
  { id: 'cognitive', label: 'Cognitive' },
]

const sports = [
  {
    id: "cricket",
    title: "Cricket",
    drills: "12 Specializations",
    imgId: "cricket-thumbnail",
    color: "bg-blue-500",
    focus: "Anticipatory Cognition",
    layer: "Layer 3"
  },
  {
    id: "tennis",
    title: "Tennis",
    drills: "8 Specializations",
    imgId: "tennis-thumbnail",
    color: "bg-green-500",
    focus: "Choice Reaction Time",
    layer: "Layer 2"
  },
  {
    id: "soccer",
    title: "Soccer",
    drills: "15 Specializations",
    imgId: "soccer-thumbnail",
    color: "bg-amber-500",
    focus: "Spatial Awareness",
    layer: "Layer 1"
  },
  {
    id: "boxing",
    title: "Boxing",
    drills: "10 Specializations",
    imgId: "boxing-thumbnail",
    color: "bg-red-500",
    focus: "Fatigue Resistance",
    layer: "Layer 4"
  }
]

export default function TrainingHubPage() {
  const getImg = (id: string) => PlaceHolderImagesMap[id]

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-0">
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12 pt-16">
        <header className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Curated Disciplines</p>
            <h1 className="text-6xl font-headline font-bold tracking-tighter leading-[0.8]">Training Hub.</h1>
            <p className="text-xl text-muted-foreground font-medium">Select a neural domain to begin your session.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search drills..." 
                className="w-full h-12 pl-11 pr-4 rounded-full bg-secondary border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 bg-white border">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={cn(
                "px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                cat.id === 'all' ? "bg-black text-white" : "bg-white border text-muted-foreground hover:border-black hover:text-black"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sports.map((sport) => {
            const img = getImg(sport.imgId)
            return (
              <Link key={sport.id} href={`/drills/${sport.id}`} className="group">
                <Card className="relative h-[500px] overflow-hidden rounded-[3.5rem] border-none group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-700">
                  <Image 
                    src={img?.imageUrl || ""} 
                    alt={sport.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    data-ai-hint={img?.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent p-10 flex flex-col justify-end text-white">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <Badge className="bg-white/10 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.2em] border-none py-1.5 px-4 rounded-full">
                          {sport.layer}
                        </Badge>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-headline font-bold tracking-tight leading-none">{sport.title}</h3>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{sport.drills}</p>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                          <BrainCircuit className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{sport.focus}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        <section className="pt-12">
          <Card className="bg-black text-white p-12 rounded-[4rem] border-none relative overflow-hidden group">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Badge className="bg-primary text-[9px] font-black uppercase tracking-[0.4em] py-2 px-6 rounded-full border-none">Neuro-Flash Challenge</Badge>
                <h2 className="text-5xl font-headline font-bold leading-[0.9] tracking-tighter">Mixed Reality <br />Circuit Training.</h2>
                <p className="text-white/60 text-lg leading-relaxed max-w-sm">Combine multiple disciplines in a single 15-minute high-intensity cognitive load session.</p>
                <Button variant="secondary" className="h-16 px-10 rounded-full font-black text-xs uppercase tracking-widest bg-white text-black hover:bg-white/90">
                  Begin Circuit <Zap className="ml-2 w-4 h-4 fill-current" />
                </Button>
              </div>
              <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10">
                <Image 
                  src={getImg('circuit-main')?.imageUrl || ""} 
                  alt="Circuit" 
                  fill 
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s]"
                  data-ai-hint={getImg('circuit-main')?.imageHint}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center border border-primary/20 animate-pulse">
                    <Zap className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-[-10%] top-[-10%] w-1/2 aspect-square bg-primary/10 rounded-full blur-[120px]" />
          </Card>
        </section>
      </div>
      <Navigation />
    </div>
  )
}
