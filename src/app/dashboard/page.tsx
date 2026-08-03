
"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Trophy, Activity, Zap, Clock, ChevronRight, LogIn, BrainCircuit, Timer } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useUser, useDoc, useAuth, useFirestore } from "@/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { PlaceHolderImages, PlaceHolderImagesMap } from "@/lib/placeholder-images"
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors'

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser()
  const auth = useAuth()
  const db = useFirestore()
  const { data: profile } = useDoc(user && db ? doc(db, 'users', user.uid) : null)

  const handleSignIn = async () => {
    if (!auth || !db) return
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const userDoc = doc(db, 'users', result.user.uid)
      const data = {
        uid: result.user.uid,
        displayName: result.user.displayName,
        skillLevel: 'intermediate',
        streak: 0,
        avgReactionTime: 250,
        accuracy: 85,
      };
      
      setDoc(userDoc, data, { merge: true })
        .catch(async (err) => {
          const permissionError = new FirestorePermissionError({
            path: userDoc.path,
            operation: 'write',
            requestResourceData: data,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });
    } catch (error) {
      console.error("Sign in failed", error)
    }
  }

  const getImg = (id: string) => PlaceHolderImagesMap[id]

  if (userLoading) return null

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-0">
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 pt-10">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Biometric Performance</p>
            <h1 className="text-5xl font-headline font-bold tracking-tighter">
              {user ? `Good morning, ${user.displayName?.split(' ')[0]}.` : "Welcome to Reflexes."}
            </h1>
          </div>
          <div className="flex gap-4">
            {!user ? (
              <Button onClick={handleSignIn} className="rounded-full h-14 px-10 font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20">
                <LogIn className="mr-2 h-4 w-4" /> Sign In to Track
              </Button>
            ) : (
              <>
                <Button variant="secondary" className="rounded-full h-14 px-8 font-black text-xs uppercase tracking-widest bg-white shadow-sm border" asChild>
                  <Link href="/stats">Insights</Link>
                </Button>
                <Button className="rounded-full h-14 px-10 font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20" asChild>
                  <Link href="/drills">Quick Start</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Activity className="text-primary" />} label="Avg. Reaction" value={profile?.avgReactionTime || "—"} unit="ms" trend="-12" />
          <StatCard icon={<Trophy className="text-amber-500" />} label="Global Rank" value="#4.2" unit="k" trend="+15" />
          <StatCard icon={<Zap className="text-cyan-500" />} label="Training Streak" value={profile?.streak || "0"} unit="Days" />
          <StatCard icon={<Clock className="text-purple-500" />} label="Accuracy" value={profile?.accuracy || "—"} unit="%" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 overflow-hidden group border-none glass-pro rounded-[3rem]">
            <div className="relative h-[400px] w-full">
              <Image 
                src={getImg('cricket-main')?.imageUrl || ""} 
                alt="Recommended" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                data-ai-hint={getImg('cricket-main')?.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-12 flex flex-col justify-end text-white">
                <Badge className="w-fit mb-6 bg-primary text-[9px] font-black tracking-[0.3em] uppercase py-1.5 px-4 rounded-full border-none">Personalized Session</Badge>
                <h3 className="text-4xl font-headline font-bold mb-3 tracking-tight leading-tight">The Slip Cordon</h3>
                <p className="text-white/60 max-w-md text-lg font-medium leading-relaxed">Focusing on Layer 3: Anticipatory Cognition. Based on your recent performance trends.</p>
              </div>
            </div>
            <CardContent className="p-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-1 w-full md:w-auto">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Neuro-Focus Area</p>
                <p className="text-lg font-bold">Predictive Neural Response</p>
              </div>
              <Button asChild className="rounded-full px-10 h-14 text-md font-black uppercase tracking-widest group w-full md:w-auto">
                <Link href="/drills/cricket">
                  Launch Session <Play className="ml-3 w-4 h-4 fill-current" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black text-white rounded-[3rem] border-none p-12 flex flex-col justify-between shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
            <div className="space-y-10">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Weekly Target</p>
                <h4 className="text-3xl font-headline font-bold leading-tight">Fatigue <br />Resistance</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                  <span className="opacity-40">Progress</span>
                  <span className="text-primary">75%</span>
                </div>
                <Progress value={75} className="bg-white/10 h-3 rounded-full" />
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Next Milestone</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg">Boxing (Tired Rounds)</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full h-14 rounded-full font-black text-xs uppercase tracking-[0.2em] text-black bg-white hover:bg-white/90">Upgrade Training Plan</Button>
            </div>
          </Card>
        </div>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-headline font-bold tracking-tight">Training Domains</h2>
            <Button variant="ghost" className="text-primary font-black text-xs uppercase tracking-widest hover:bg-transparent" asChild>
              <Link href="/drills">See All Fields <ChevronRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard title="Cricket" sport="cricket" drills="12" imgId="cricket-thumbnail" />
            <CategoryCard title="Soccer" sport="soccer" drills="8" imgId="soccer-thumbnail" />
            <CategoryCard title="Tennis" sport="tennis" drills="6" imgId="tennis-thumbnail" />
            <CategoryCard title="Boxing" sport="boxing" drills="15" imgId="boxing-thumbnail" />
          </div>
        </section>
      </div>
      <Navigation />
    </div>
  )
}

function StatCard({ icon, label, value, unit, trend }: any) {
  return (
    <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm flex flex-col gap-6 transition-all hover:shadow-md hover:-translate-y-1">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
        {icon}
      </div>
      <div className="space-y-2">
        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-headline font-bold">{value}</span>
          <span className="text-sm font-bold text-muted-foreground">{unit}</span>
          {trend && (
            <span className={cn(
              "text-[10px] font-black ml-auto px-3 py-1 rounded-full",
              trend.startsWith('+') ? "bg-green-50 text-green-700" : "bg-primary/5 text-primary"
            )}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

function CategoryCard({ title, sport, drills, imgId }: any) {
  const getImg = (id: string) => PlaceHolderImagesMap[id]
  const img = getImg(imgId)

  return (
    <Link href={`/drills/${sport}`} className="group">
      <Card className="relative h-64 overflow-hidden rounded-[3rem] border-none group-hover:shadow-2xl transition-all duration-700">
        <Image 
          src={img?.imageUrl || ""} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
          data-ai-hint={img?.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
          <h3 className="text-2xl font-headline font-bold text-white tracking-tight">{title}</h3>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{drills} Specializations</p>
        </div>
      </Card>
    </Link>
  )
}
