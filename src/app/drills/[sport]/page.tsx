
"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ARDrillView } from "@/components/ar-drill-view"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Zap, Target, BrainCircuit, Activity, ChevronRight, Loader2 } from "lucide-react"
import { dynamicAdaptiveDrills, type DynamicAdaptiveDrillsOutput } from "@/ai/flows/dynamic-adaptive-drills"
import { cn } from "@/lib/utils"

type DrillState = 'briefing' | 'active'

export default function SportDrillPage() {
  const { sport } = useParams()
  const router = useRouter()
  const [drillState, setDrillState] = useState<DrillState>('briefing')
  const [isGenerating, setIsGenerating] = useState(true)
  const [drillConfig, setDrillConfig] = useState<DynamicAdaptiveDrillsOutput | null>(null)

  const drillTitles: Record<string, string> = {
    cricket: "The Slip Cordon",
    tennis: "Serve Return Machine",
    soccer: "The Last Defender",
    boxing: "Shadow Boxer+",
    basketball: "The Point Guard's Eye",
  }

  const title = drillTitles[sport as string] || "Reflex Trainer"

  useEffect(() => {
    async function fetchDrillConfig() {
      try {
        const config = await dynamicAdaptiveDrills({
          sport: sport as string,
          skillLevel: 'intermediate',
          currentPerformanceData: "Reaction time: 242ms, Accuracy: 91%, Streak: 12 days",
          lastDrillOutcome: 'success',
        })
        setDrillConfig(config)
      } catch (error) {
        console.error("Failed to generate drill:", error)
      } finally {
        setIsGenerating(false)
      }
    }
    fetchDrillConfig()
  }, [sport])

  if (drillState === 'active' && drillConfig) {
    return (
      <div className="fixed inset-0 flex flex-col bg-background">
        <header className="px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-md z-40">
          <Button variant="ghost" size="icon" onClick={() => setDrillState('briefing')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1">AI Optimized</Badge>
            <h1 className="text-sm font-headline font-bold uppercase tracking-widest">{drillConfig.drillName}</h1>
          </div>
          <div className="w-10" />
        </header>
        
        <main className="flex-1 relative overflow-hidden">
          <ARDrillView 
            sport={sport as string} 
            drillName={drillConfig.drillName} 
            onComplete={() => {}}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col p-6 md:p-12">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <header className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-full h-12 px-6 font-bold text-xs uppercase tracking-widest hover:bg-white">
            <ArrowLeft className="mr-2 w-4 h-4" /> Exit Hub
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Target className="text-white w-4 h-4" />
            </div>
            <span className="text-sm font-headline font-bold uppercase tracking-tighter">REFLEXES</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Pre-Session Intelligence</p>
              <h1 className="text-6xl font-headline font-bold tracking-tighter leading-[0.9]">{title}</h1>
              <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                Our neural models have prepared a specialized protocol based on your recent 15ms reaction improvement.
              </p>
            </div>

            {isGenerating ? (
              <Card className="p-12 rounded-[3rem] border-none shadow-sm bg-white flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-bold">Synthesizing Session Data...</p>
                  <p className="text-xs text-muted-foreground font-medium">Analyzing current load & spatial constraints</p>
                </div>
              </Card>
            ) : drillConfig ? (
              <Card className="p-10 rounded-[3rem] border-none shadow-sm bg-white space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Reasoning</p>
                    <p className="text-lg font-medium leading-relaxed">{drillConfig.reasoning}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-[2rem] bg-[#F2F2F7] space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Difficulty Adjustment</p>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-xl font-bold capitalize">{drillConfig.difficultyAdjustment}</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-[#F2F2F7] space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">AR Elements</p>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-500" />
                      <span className="text-xl font-bold">{drillConfig.arElements.length} Spatial Layers</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setDrillState('active')}
                  className="w-full h-20 rounded-full text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 group"
                >
                  Engage Protocol <ChevronRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            ) : null}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-black text-white p-10 rounded-[3rem] border-none space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Requirements</p>
              <ul className="space-y-6">
                <RequirementItem icon={<Zap className="text-primary" />} text="3m Clear Spatial Field" />
                <RequirementItem icon={<Activity className="text-green-500" />} text="Optimal Luminance (600+ Lux)" />
                <RequirementItem icon={<Target className="text-cyan-500" />} text="Full Body Visualization" />
              </ul>
            </Card>

            <Card className="p-10 rounded-[3rem] border-none shadow-sm bg-white/50 backdrop-blur-sm space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Pro Coach Tip</p>
              <p className="text-sm font-medium leading-relaxed italic">
                "Keep your weight on the balls of your feet. Sub-millisecond improvements start with your kinetic chain, not just your eyes."
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function RequirementItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">{icon}</div>
      <span className="text-sm font-bold tracking-tight">{text}</span>
    </li>
  )
}
