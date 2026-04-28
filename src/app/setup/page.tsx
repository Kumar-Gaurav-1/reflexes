
"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Sun, Maximize, Target, ChevronRight, Loader2, Scan, Activity } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

function SetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/dashboard'
  
  const [step, setStep] = useState(1)
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const steps = [
    { title: "Device Placement", desc: "Optimal angle confirms full-body skeletal tracking.", icon: Target },
    { title: "Lighting Quality", desc: "Analyzing ambient luminance for tracking stability.", icon: Sun },
    { title: "Clutter Scan", desc: "Detecting background motion to prevent interference.", icon: Activity },
    { title: "Space Mapping", desc: "Mapping a safe 3m radius for kinetic movement.", icon: Maximize },
    { title: "Neural Sync", desc: "Synchronizing biometric frame with the vision lab.", icon: Scan },
  ]

  useEffect(() => {
    async function startCamera() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop())
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user', 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          } 
        })
        
        streamRef.current = stream
        setHasCameraPermission(true)
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(console.error)
        }
      } catch (e) {
        console.error("Camera error:", e)
        setHasCameraPermission(false)
        toast({
          title: "Optical Access Required",
          description: "Camera permissions are essential for biometric tracking.",
          variant: "destructive"
        })
      }
    }
    
    startCamera()
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const handleNext = () => {
    if (step < steps.length) {
      setIsCalibrating(true)
      // Simulate CV Analysis duration per step
      const durations = [1500, 2000, 1500, 2500, 2000]
      setTimeout(() => {
        setIsCalibrating(false)
        setStep(s => s + 1)
        toast({
          title: `${steps[step-1].title} Verified`,
          description: "Calibration parameters synchronized."
        })
      }, durations[step - 1])
    } else {
      toast({ title: "Sovereign Lab Ready", description: "All sensors synchronized. Launching mission..." })
      setTimeout(() => router.push(nextUrl), 800)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-0">
      <div className="max-w-xl mx-auto p-6 md:p-10 space-y-12 pt-16">
        <header className="text-center space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Room Intelligence Wizard</p>
          <h1 className="text-4xl font-headline font-bold tracking-tighter">Vision Lab Setup</h1>
          <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto leading-relaxed">
            Ensure your environment meets the precision standards for elite performance tracking.
          </p>
        </header>

        <div className="flex justify-between items-center px-2 relative">
          <div className="absolute top-5 left-10 right-10 h-[1px] bg-border -z-10" />
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm",
                step > i + 1 ? "bg-primary text-white" : step === i + 1 ? "bg-white border-2 border-primary text-primary" : "bg-white border text-muted-foreground"
              )}>
                {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </div>

        <Card className="overflow-hidden border-none shadow-[0_40px_100px_rgba(0,0,0,0.08)] rounded-[3rem] bg-black group relative">
          <div className="relative aspect-[3/4]">
            {hasCameraPermission === false ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                    <Target className="text-red-500 w-8 h-8" />
                  </div>
                  <p className="text-white text-sm font-bold">Hardware Link Failed</p>
                  <p className="text-white/40 text-xs">Please allow camera access in browser settings.</p>
                  <Button variant="outline" className="border-white/20 text-white" onClick={() => window.location.reload()}>Retry Connection</Button>
               </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="camera-feed opacity-80" 
              />
            )}
            
            <div className="ar-overlay flex items-center justify-center">
              <div className="absolute inset-0 border-[20px] border-white/5 rounded-[3rem]" />
              <div className="absolute left-0 right-0 h-1 bg-primary/50 blur-sm shadow-[0_0_20px_rgba(0,113,227,0.8)] animate-neural-scan" />

              {isCalibrating && (
                <div className="absolute inset-0 flex items-center justify-center glass-dark backdrop-blur-md z-20">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Synthesizing {steps[step-1].title}...</p>
                  </div>
                </div>
              )}

              {step === 5 && !isCalibrating && (
                <div className="w-[85%] h-[92%] border-2 border-dashed border-primary/40 rounded-[2.5rem] animate-pulse flex items-center justify-center">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/20 rounded-full animate-spatial-scan" />
                  <div className="glass-dark px-6 py-2 rounded-full border border-white/10">
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Frame</p>
                  </div>
                </div>
              )}
              
              {step === 1 && !isCalibrating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-64 h-96 border-2 border-primary/30 rounded-3xl animate-pulse" />
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6 glass-dark p-6 rounded-[2rem] border-white/5 backdrop-blur-xl">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Scan className="text-primary w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-white text-sm font-bold tracking-tight">Step {step}: {steps[step-1].title}</p>
                  <p className="text-white/60 text-xs leading-relaxed font-medium">{steps[step-1].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Button size="lg" className="w-full rounded-full h-16 text-md font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group" onClick={handleNext} disabled={isCalibrating || hasCameraPermission === false}>
            {step === steps.length ? "Finalize Synchronization" : "Proceed to Next Step"}
            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em]" asChild>
            <Link href="/dashboard">Direct to Dashboard</Link>
          </Button>
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <SetupContent />
    </Suspense>
  )
}
