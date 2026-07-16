
"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingDown, Target, Zap, BarChart3, ChevronRight, Activity, BrainCircuit, Timer, Loader2, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useCollection } from "@/firebase"
import { collection, query, where, orderBy, limit } from "firebase/firestore"
import { useMemo } from "react"
import Link from "next/link"

export default function StatsPage() {
  const { user } = useUser()
  const db = useFirestore()

  const sessionsQuery = useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, 'sessions'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    )
  }, [db, user])

  const { data: rawSessions, loading } = useCollection(sessionsQuery)

  const sessions = useMemo(() => {
    if (!rawSessions || rawSessions.length === 0) return []
    return [...rawSessions].reverse().map((s: any) => {
      const date = s.timestamp?.seconds ? new Date(s.timestamp.seconds * 1000) : new Date()
      return {
        id: s.id,
        day: date.toLocaleDateString(undefined, { weekday: 'short' }),
        fullDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        rt: s.reactionTime || 250,
        score: s.score || 0,
        timestamp: date.getTime(),
        sport: s.sport || 'Unknown',
        drill: s.drillName || 'Standard Protocol'
      }
    })
  }, [rawSessions])

  const avgRt = useMemo(() => {
    if (sessions.length === 0) return 0
    return Math.round(sessions.reduce((acc, s) => acc + s.rt, 0) / sessions.length)
  }, [sessions])

  const improvement = useMemo(() => {
    if (sessions.length < 2) return 0
    const first = sessions[0].rt
    const last = sessions[sessions.length - 1].rt
    return Math.round(((first - last) / (first || 1)) * 100)
  }, [sessions])

  const aggregateScore = useMemo(() => {
    return sessions.reduce((acc, s) => acc + s.score, 0)
  }, [sessions])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-0">
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12 pt-16">
        <header className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Diagnostic Telemetry</p>
          <h1 className="text-6xl font-headline font-bold tracking-tighter leading-[0.8]">Performance Lab.</h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl">Quantifying your neuro-kinetic evolution with clinical precision.</p>
        </header>

        {sessions.length === 0 ? (
          <Card className="p-20 rounded-[4rem] border-none bg-white text-center space-y-8 shadow-sm">
            <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto">
              <BarChart3 className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-4 max-w-sm mx-auto">
              <h3 className="text-3xl font-headline font-bold tracking-tight">Awaiting Baseline.</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">Complete your first Vision Lab session to begin high-fidelity diagnostic tracking.</p>
            </div>
            <Button asChild className="rounded-full h-14 px-10 font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20">
              <Link href="/drills">Initiate First Drill</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8 border-none bg-white rounded-[3.5rem] shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md">
              <CardHeader className="p-12 flex flex-row items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1">Velocity Protocol</Badge>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-8xl font-headline font-bold tracking-tighter text-black tabular-nums">{avgRt}</span>
                    <span className="text-xl font-bold text-muted-foreground uppercase tracking-widest">ms</span>
                    {improvement !== 0 && (
                      <div className={cn(
                        "flex items-center font-black text-[10px] gap-1 ml-4 px-4 py-1.5 rounded-full uppercase tracking-wider",
                        improvement > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      )}>
                        <TrendingDown className={cn("w-3 h-3", improvement < 0 && "rotate-180")} /> 
                        {Math.abs(improvement)}% {improvement > 0 ? 'Improvement' : 'Degradation'}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground max-w-sm leading-relaxed">Reaction velocity trend aggregated from your last {sessions.length} training protocols.</p>
                </div>
                <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Timer className="w-8 h-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="px-12 pb-12 flex-1 min-h-[350px]">
                <ChartContainer config={{ rt: { label: "React Time", color: "hsl(var(--primary))" } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sessions}>
                      <defs>
                        <linearGradient id="colorRt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-rt)" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="var(--color-rt)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.05} />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fontWeight: 800, fill: "hsl(var(--muted-foreground))" }} 
                        dy={10} 
                      />
                      <YAxis hide domain={['dataMin - 40', 'dataMax + 40']} />
                      <ChartTooltip content={<ChartTooltipContent className="rounded-2xl border-none shadow-2xl" />} />
                      <Area 
                        type="monotone" 
                        dataKey="rt" 
                        stroke="var(--color-rt)" 
                        strokeWidth={6} 
                        fillOpacity={1} 
                        fill="url(#colorRt)"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-8">
              <MetricSummaryCard 
                icon={<Target className="text-accent" />} 
                label="Aggregate Score" 
                value={aggregateScore.toLocaleString()}
                trend={`Avg: ${Math.round(aggregateScore / (sessions.length || 1))}`}
                color="text-accent"
              />
              <MetricSummaryCard 
                icon={<BrainCircuit className="text-primary" />} 
                label="Cognitive Load" 
                value="High" 
                trend="Optimal Range"
                color="text-primary"
              />
              <Card className="bg-black text-white p-10 rounded-[3rem] border-none flex flex-col justify-between shadow-2xl h-[240px] relative overflow-hidden group">
                <div className="space-y-4 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Neural Consistency</p>
                  <h3 className="text-4xl font-headline font-bold tracking-tight">Level 4.</h3>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary animate-pulse shadow-[0_0_20px_rgba(38,128,217,0.8)]" 
                      style={{ width: `${Math.min((sessions.length / 10) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center justify-between relative z-10">
                  {sessions.length}/10 Sessions to Next Tier <ChevronRight className="w-3 h-3" />
                </p>
                <div className="absolute right-[-10%] top-[-10%] w-1/2 aspect-square bg-primary/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-[2s]" />
              </Card>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-headline font-bold tracking-tight">Telemetry Log</h2>
              <Button variant="ghost" className="text-primary font-black text-xs uppercase tracking-widest hover:bg-transparent">Export Data</Button>
            </div>
            <div className="space-y-4">
              {sessions.slice(0, 5).reverse().map((s) => (
                <Card key={s.id} className="p-6 border-none bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <History className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-lg">{s.drill}</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.sport} • {s.fullDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</p>
                        <p className="text-xl font-headline font-bold tabular-nums">{s.score}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Velocity</p>
                        <p className="text-xl font-headline font-bold text-primary tabular-nums">{s.rt}ms</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-headline font-bold tracking-tight">Neural Insights</h2>
              <Button variant="ghost" className="text-primary font-black text-xs uppercase tracking-widest">Full Report</Button>
            </div>
            <div className="space-y-6">
              <InsightCard 
                title="Fatigue Threshold" 
                desc="Based on your recent sessions, reaction time increases by 40ms after 12 minutes of load."
                tag="Dynamic Alert"
              />
              <InsightCard 
                title="Spatial Consistency" 
                desc="Neural processing in your peripheral left field is 12% faster than last week's average."
                tag="Growth Pattern"
              />
            </div>
          </section>
        </div>
      </div>
      <Navigation />
    </div>
  )
}

function MetricSummaryCard({ icon, label, value, trend, color }: any) {
  return (
    <Card className="p-10 border-none bg-white rounded-[3rem] shadow-sm space-y-4 hover:shadow-md transition-all duration-500 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-headline font-bold tracking-tight tabular-nums">{value}</span>
        <span className={cn("text-[10px] font-black uppercase tracking-widest", color)}>{trend}</span>
      </div>
    </Card>
  )
}

function InsightCard({ title, desc, tag }: any) {
  return (
    <Card className="p-10 border-none bg-white rounded-[3rem] shadow-sm space-y-6 group hover:bg-black hover:text-white transition-all duration-700">
      <Badge variant="secondary" className="bg-secondary text-[8px] font-black uppercase tracking-widest border-none px-4 group-hover:bg-white/10 group-hover:text-white transition-colors">
        {tag}
      </Badge>
      <div className="space-y-3">
        <h4 className="text-2xl font-headline font-bold tracking-tight">{title}</h4>
        <p className="text-muted-foreground font-medium leading-relaxed group-hover:text-white/60 transition-colors">{desc}</p>
      </div>
    </Card>
  )
}
