
"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Maximize, Target, ChevronRight } from "lucide-react"

export default function OnboardingSetupPage() {
  const { sport } = useParams()
  const router = useRouter()

  const handleStartSetup = () => {
    router.push(`/setup?next=/onboarding/${sport}/tutorial`)
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-2xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Onboarding Journey 2/5</p>
          <h1 className="text-5xl font-headline font-bold tracking-tighter">Prepare Your Environment.</h1>
          <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto">
            Our neural sensors require a specific spatial configuration to track at sub-millisecond precision.
          </p>
        </header>

        <div className="grid gap-6">
          <OnboardingStep 
            icon={<Maximize className="text-primary" />} 
            title="3m Spatial Field" 
            desc="Clear a radius of 3 meters to allow full kinetic movement without obstruction."
          />
          <OnboardingStep 
            icon={<ShieldCheck className="text-green-500" />} 
            title="Luminance Standards" 
            desc="Ensure even lighting (600+ Lux) for high-frequency skeletal tracking."
          />
          <OnboardingStep 
            icon={<Target className="text-cyan-500" />} 
            title="Optical Calibration" 
            desc="We will scan your biometric frame to synchronize the digital and physical lab."
          />
        </div>

        <Button 
          onClick={handleStartSetup}
          className="w-full h-20 rounded-full text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 group"
        >
          Initialize Sensors <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Button>
      </div>
    </div>
  )
}

function OnboardingStep({ icon, title, desc }: any) {
  return (
    <Card className="p-8 rounded-[2.5rem] border-none bg-white shadow-sm flex items-start gap-6">
      <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed">{desc}</p>
      </div>
    </Card>
  )
}
