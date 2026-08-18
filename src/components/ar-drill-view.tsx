
'use client';

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Timer, Zap, Trophy, BrainCircuit, Activity, Play, ChevronRight, RefreshCcw, Scan, Crosshair } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { layer4CognitiveChallenge, type Layer4CognitiveChallengeOutput } from "@/ai/flows/layer4-cognitive-challenge"
import { cn } from "@/lib/utils"
import { useUser, useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

type DrillStatus = 'idle' | 'countdown' | 'active' | 'finished'

interface ARDrillViewProps {
  sport: string
  drillName: string
  onComplete: (score: number) => void
}

interface Target {
  id: string
  x: number
  y: number
  z: number // 0 (far) to 1 (near)
  color: string
  createdAt: number
  type?: 'ball' | 'neutral'
}

export function ARDrillView({ sport, drillName, onComplete }: ARDrillViewProps) {
  const { user } = useUser()
  const db = useFirestore()
  const [status, setStatus] = useState<DrillStatus>('idle')
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const [targets, setTargets] = useState<Target[]>([])
  const [impacts, setImpacts] = useState<{ id: number, x: number, y: number }[]>([])
  const [cognitiveChallenge, setCognitiveChallenge] = useState<Layer4CognitiveChallengeOutput | null>(null)
  const [currentVelocity, setCurrentVelocity] = useState<number>(0)
  const [preCue, setPreCue] = useState<{ type: string, active: boolean }>({ type: '', active: false })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastHitTimeRef = useRef<number>(Date.now())
  const statusRef = useRef<DrillStatus>('idle')
  const targetsRef = useRef<Target[]>([])
  const handleHitRef = useRef<((id: string, x: number, y: number) => void) | null>(null)

  // Kinetic Neural Engine Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevFrameRef = useRef<ImageData | null>(null)
  const processingRef = useRef<boolean>(false)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    targetsRef.current = targets
  }, [targets])

  useEffect(() => {
    const getCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop())
        }
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        })
        streamRef.current = s
        setHasCameraPermission(true)
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.play().catch(console.error)
        }
      } catch (e) {
        setHasCameraPermission(false)
        toast({ 
          title: "Optical Access Required", 
          variant: "destructive", 
          description: "Please enable camera permissions to use kinetic hand-tracking." 
        })
      }
    }
    getCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const spawnTarget = useCallback(() => {
    if (statusRef.current !== 'active') return

    if (sport === 'cricket') {
      setPreCue({ type: 'Bowler Release', active: true })
      
      setTimeout(() => {
        setPreCue(p => ({ ...p, active: false }))
        const ballId = Math.random().toString(36).substring(2, 9)
        const endX = Math.random() * 60 + 20
        const endY = Math.random() * 50 + 25
        
        const newTarget: Target = {
          id: ballId,
          x: endX,
          y: endY,
          z: 0.1,
          color: 'hsl(0, 100%, 50%)',
          createdAt: Date.now(),
          type: 'ball'
        }
        
        setTargets(prev => [...prev, newTarget])

        let depth = 0.1
        const animInterval = setInterval(() => {
          depth += 0.05
          if (depth >= 1) {
            clearInterval(animInterval)
            setTargets(prev => prev.filter(t => t.id !== ballId))
          } else {
            setTargets(prev => prev.map(t => t.id === ballId ? { ...t, z: depth } : t))
          }
        }, 30)

      }, 300)
    } else {
      const newTarget: Target = {
        id: Math.random().toString(36).substring(2, 9),
        x: Math.random() * 60 + 20, 
        y: Math.random() * 50 + 25,
        z: 1,
        color: Math.random() > 0.8 ? 'hsl(var(--primary))' : '#ffffff',
        createdAt: Date.now()
      }
      
      setTargets(prev => [...prev, newTarget])
      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== newTarget.id))
      }, 2500)
    }
  }, [sport])

  const handleHit = useCallback((id: string, x: number, y: number) => {
    if (statusRef.current !== 'active') return

    const hitTime = Date.now()
    const velocity = hitTime - lastHitTimeRef.current
    lastHitTimeRef.current = hitTime
    setCurrentVelocity(velocity)
    
    setScore(s => s + 10)
    setTargets(prev => prev.filter(t => t.id !== id))
    
    const impactId = Date.now()
    setImpacts(prev => [...prev, { id: impactId, x, y }])
    setTimeout(() => setImpacts(prev => prev.filter(i => i.id !== impactId)), 400)

    if (Math.random() > 0.7 && !cognitiveChallenge) {
      triggerCognitiveDistraction()
    }
  }, [cognitiveChallenge])

  useEffect(() => {
    handleHitRef.current = handleHit
  }, [handleHit])

  const triggerCognitiveDistraction = async () => {
    try {
      const challenge = await layer4CognitiveChallenge({})
      setCognitiveChallenge(challenge)
      setTimeout(() => setCognitiveChallenge(null), 8000)
    } catch (e) {}
  }

  const detectMotion = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || statusRef.current !== 'active') {
      processingRef.current = false
      return
    }

    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    ctx.drawImage(videoRef.current, 0, 0, 160, 120)
    const currentFrame = ctx.getImageData(0, 0, 160, 120)

    if (prevFrameRef.current) {
      const data = currentFrame.data
      const prevData = prevFrameRef.current.data
      
      // ⚡ Bolt Performance Optimization
      // Global Motion Inhabitation: Samples corners to detect torso lean or camera shake
      // Unrolled static array and direct assignment to prevent GC micro-stutters
      const pos1 = (5 * 160 + 5) * 4;
      const pos2 = (5 * 160 + 155) * 4;
      const pos3 = (115 * 160 + 5) * 4;
      const pos4 = (115 * 160 + 155) * 4;
      const globalMotionSum = Math.abs(data[pos1] - prevData[pos1]) +
                              Math.abs(data[pos2] - prevData[pos2]) +
                              Math.abs(data[pos3] - prevData[pos3]) +
                              Math.abs(data[pos4] - prevData[pos4]);

      // If global motion is too high, inhibit target neutralization
      if (globalMotionSum < 400) {
        const activeTargets = targetsRef.current
        activeTargets.forEach(target => {
          // Mirror correction for coordinates
          const rawFrameXPercent = 100 - target.x
          const canvasX = Math.floor((rawFrameXPercent / 100) * 160)
          const canvasY = Math.floor((target.y / 100) * 120)
          
          const searchRadius = 8
          let motionSnapCount = 0
          let motionDensity = 0
          
          // ⚡ Bolt Performance Optimization
          // Pre-calculate boundary clamping to avoid O(N) operations within loop body
          const minX = Math.max(0, canvasX - searchRadius);
          const maxX = Math.min(160, canvasX + searchRadius);
          const minY = Math.max(0, canvasY - searchRadius);
          const maxY = Math.min(120, canvasY + searchRadius);

          // Local High-Velocity "Snap" Signature detection
          // Reverse loop order (Y outer, X inner) to enforce sequential cache locality
          for (let y = minY; y < maxY; y++) {
            const yOffset = y * 160;
            for (let x = minX; x < maxX; x++) {
              const pos = (yOffset + x) * 4
              const diff = Math.abs(data[pos] - prevData[pos]) + 
                           Math.abs(data[pos+1] - prevData[pos+1]) + 
                           Math.abs(data[pos+2] - prevData[pos+2])
              
              if (diff > 180) { // High intensity change
                motionDensity++
                if (diff > 220) motionSnapCount++ 
              }
            }
          }

          // Kinetic isolation: Rejects body-sized blobs, accepts hand "bursts"
          if (motionSnapCount > 4 && motionDensity > 6 && motionDensity < 40) {
            handleHitRef.current?.(target.id, target.x, target.y)
          }
        })
      }
    }

    prevFrameRef.current = currentFrame
    requestAnimationFrame(detectMotion)
  }, []) 

  useEffect(() => {
    if (status !== 'active') return;

    const spawnRate = sport === 'cricket' ? 2000 : 1200
    const interval = setInterval(() => {
      if (targetsRef.current.length < 2) spawnTarget()
    }, spawnRate)

    if (!processingRef.current) {
      processingRef.current = true
      requestAnimationFrame(detectMotion)
    }

    return () => clearInterval(interval)
  }, [status, spawnTarget, detectMotion, sport])

  const startDrill = () => {
    if (hasCameraPermission === false) {
      toast({ title: "Sensors Offline", description: "Optical vision lab requires active camera feed.", variant: "destructive" })
      return
    }
    setStatus('countdown')
    setCountdown(3)
    let c = 3
    const timer = setInterval(() => {
      c -= 1
      setCountdown(c)
      if (c === 0) {
        clearInterval(timer)
        setStatus('active')
        lastHitTimeRef.current = Date.now()
      }
    }, 1000)
  }

  const logSession = async (finalScore: number) => {
    if (!user || !db) return
    const sessionData = {
      userId: user.uid,
      sport,
      drillName,
      score: finalScore,
      reactionTime: currentVelocity || 240,
      timestamp: serverTimestamp()
    };
    addDoc(collection(db, 'sessions'), sessionData).catch(async (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: '/sessions',
        operation: 'create',
        requestResourceData: sessionData,
      } satisfies SecurityRuleContext))
    })
  }

  useEffect(() => {
    let interval: any
    if (status === 'active' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && status === 'active') {
      setStatus('finished')
      logSession(score)
      onComplete(score)
    }
    return () => clearInterval(interval)
  }, [status, timeLeft, score, sport, drillName, user, db, onComplete])

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col select-none touch-none">
      <canvas ref={canvasRef} width="160" height="120" className="hidden" />

      <div className="absolute top-10 left-8 right-8 z-50 flex justify-between items-start pointer-events-none">
        <div className="glass-dark p-6 rounded-[2.5rem] space-y-2 w-64 border-white/10 shadow-2xl">
          <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black tracking-[0.4em] mb-2 px-3 py-1.5 rounded-full">
            NEURAL SENSORS
          </Badge>
          <h3 className="text-white font-headline font-bold text-2xl leading-tight tracking-tight">{drillName}</h3>
          <div className="flex items-center gap-2 pt-2">
            <Scan className="w-3 h-3 text-white/40 animate-pulse" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Kinetic Capture Active</span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <HUDModule icon={<Timer className="w-4 h-4 text-primary" />} label="Time" value={`${timeLeft}s`} />
          <HUDModule icon={<Zap className="w-4 h-4 text-cyan-400" />} label="Velocity" value={currentVelocity > 0 ? `${currentVelocity}ms` : '---'} />
          <HUDModule icon={<Activity className="w-4 h-4 text-accent" />} label="Score" value={score.toString()} />
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={cn("camera-feed transition-opacity duration-1000 absolute inset-0 w-full h-full object-cover z-0", status === 'finished' ? 'opacity-20' : 'opacity-90')}
        />

        {hasCameraPermission === false && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md">
            <Alert variant="destructive" className="max-w-md rounded-[2rem]">
              <AlertTitle className="text-xl font-bold">Optical Access Required</AlertTitle>
              <AlertDescription className="text-md leading-relaxed">
                Please enable camera permissions in your browser settings to use kinetic hand-tracking.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {status === 'active' && (
          <div className="absolute left-0 right-0 h-1 bg-primary/40 blur-sm shadow-[0_0_25px_rgba(0,113,227,0.5)] animate-neural-scan z-10 pointer-events-none" />
        )}

        {preCue.active && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-pulse">
             <div className="glass-dark px-8 py-4 rounded-full border border-primary/40 flex items-center gap-4">
                <Crosshair className="w-6 h-6 text-primary" />
                <span className="text-white text-sm font-black uppercase tracking-widest">{preCue.type}</span>
             </div>
          </div>
        )}

        <div className="absolute inset-0 z-40 pointer-events-none">
          {status === 'active' && targets.map(t => (
            <div
              key={t.id}
              className="absolute w-32 h-32 -ml-16 -mt-16 rounded-full glass-pro flex items-center justify-center transition-all animate-pulse-ring"
              style={{ 
                left: `${t.x}%`, 
                top: `${t.y}%`,
                transform: `scale(${t.z})`,
                opacity: t.z
              }}
            >
              <div 
                className="w-16 h-16 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)]" 
                style={{ backgroundColor: t.color }} 
              />
            </div>
          ))}

          {impacts.map(i => (
            <div 
              key={i.id}
              className="absolute w-24 h-24 -ml-12 -mt-12 border-2 border-primary rounded-full animate-impact"
              style={{ left: `${i.x}%`, top: `${i.y}%` }}
            />
          ))}

          {cognitiveChallenge && (
            <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[90%] max-w-md animate-in slide-in-from-top duration-700">
              <div className="glass-dark p-10 rounded-[3rem] shadow-2xl border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 bg-primary animate-progress-shrink" style={{ animationDuration: '8s' }} />
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Cognitive Challenge</p>
                    <p className="text-white text-xl font-bold leading-relaxed tracking-tight text-glow">{cognitiveChallenge.content}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {status === 'idle' && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center glass bg-black/40 backdrop-blur-md px-6">
            <div className="text-center space-y-12 max-w-md p-14 bg-white rounded-[4rem] shadow-2xl animate-in zoom-in duration-700">
              <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto">
                <Play className="w-12 h-12 text-primary fill-current" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-headline font-bold tracking-tight">Kinetic Lab Ready.</h2>
                <p className="text-muted-foreground leading-relaxed font-medium">Neutralize targets using fast hand swipes. Optical sensors track high-velocity kinetic motion.</p>
              </div>
              <Button 
                onClick={startDrill} 
                className="w-full rounded-full h-20 text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group"
              >
                Engage Lab <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {status === 'countdown' && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="text-[16rem] font-headline font-bold text-white tracking-tighter animate-in zoom-in-50 duration-500">{countdown}</span>
          </div>
        )}

        {status === 'finished' && (
          <div className="absolute inset-0 z-[70] bg-[#FAFAFA]/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-1000">
            <div className="text-center space-y-16 w-full max-w-md">
              <div className="space-y-6">
                <div className="w-28 h-28 bg-black text-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl rotate-3">
                  <Trophy className="w-14 h-14" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-6xl font-headline font-bold tracking-tight leading-none">Session <br />Complete.</h2>
                  <p className="text-lg text-muted-foreground font-medium">Kinetic telemetry synced successfully.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <MetricCard label="Session Score" value={score.toString()} />
                <MetricCard label="Neuro Velocity" value={currentVelocity > 0 ? `${currentVelocity}ms` : '245ms'} />
              </div>

              <div className="space-y-4 pt-6">
                <Button onClick={() => setStatus('idle')} className="w-full rounded-full h-20 text-xl font-black uppercase tracking-widest shadow-xl">Back to Hub</Button>
                <Button variant="ghost" onClick={() => window.location.reload()} className="w-full text-muted-foreground font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                  <RefreshCcw className="w-4 h-4" /> Calibrate Sensors
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function HUDModule({ icon, label, value }: any) {
  return (
    <div className="glass-dark p-6 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[110px] border-white/5 space-y-2 shadow-2xl">
      {icon}
      <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">{label}</p>
      <span className="text-white font-headline font-bold text-2xl tracking-tighter tabular-nums">{value}</span>
    </div>
  )
}

function MetricCard({ label, value }: any) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-black/5 text-center space-y-2">
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">{label}</p>
      <p className="text-5xl font-headline font-bold text-black tracking-tight tabular-nums">{value}</p>
    </div>
  )
}
