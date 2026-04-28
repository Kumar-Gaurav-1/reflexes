
"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { ARDrillView } from "@/components/ar-drill-view"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, ChevronRight, Share2, LogIn } from "lucide-react"

export default function BaselineAssessmentPage() {
  const { sport } = useParams()
  const router = useRouter()
  const [assessmentStatus, setAssessmentStatus] = useState<'active' | 'complete'>('active')
  const [results, setResults] = useState<{ rt: number, percentile: number } | null>(null)

  const handleComplete = (score: number) => {
    // Generate sports-specific baseline results
    const rt = Math.round(240 + Math.random() * 60)
    const percentile = Math.round(40 + Math.random() * 30)
    setResults({ rt, percentile })
    setAssessmentStatus('complete')
  }

  if (assessmentStatus === 'complete') {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full space-y-12 pt-10">
          <header className="text-center space-y-4">
            <Badge className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full mb-4 border-none">Baseline Synchronized</Badge>
            <h1 className="text-6xl font-headline font-bold tracking-tighter">Your Neural Signature.</h1>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-10 rounded-[3rem] border-none bg-white shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-primary w-6 h-6" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reaction Speed</p>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-8xl font-headline font-bold tracking-tighter">{results?.rt}</span>
                <span className="text-xl font-bold text-muted-foreground uppercase tracking-widest">ms</span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                That's the <span className="text-primary font-bold">{results?.percentile}rd percentile</span> for {sport} athletes in your age group. 
                Focusing on Layer 2 neural processing will help bridge the gap.
              </p>
            </Card>

            <Card className="p-10 rounded-[3rem] border-none bg-black text-white space-y-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Share2 className="text-white w-6 h-6" />
                </div>
                <h3 className="text-3xl font-headline font-bold tracking-tight">Save Your Lab Data.</h3>
                <p className="text-white/40 font-medium text-sm leading-relaxed">
                  "We never sell your data. Your training data belongs to you." - Privacy Protocol v1.0
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-16 rounded-full bg-white text-black font-black uppercase tracking-widest hover:bg-white/90"
                >
                  <LogIn className="mr-2 w-4 h-4" /> Create Profile
                </Button>
                <Button variant="ghost" onClick={() => router.push('/dashboard')} className="w-full text-white/40 text-[10px] font-black uppercase tracking-widest">Skip for Now</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <header className="absolute top-12 left-1/2 -translate-x-1/2 z-50 text-center space-y-2 pointer-events-none">
        <Badge className="bg-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-4">Phase 4/5: Baseline Assessment</Badge>
        <h2 className="text-white text-4xl font-headline font-bold tracking-tighter leading-tight">Perform 5 Fast Responses.</h2>
      </header>

      <ARDrillView 
        sport={sport as string} 
        drillName="Baseline Protocol" 
        onComplete={handleComplete}
      />
    </div>
  )
}
