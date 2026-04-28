
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, BarChart3, Play } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Training", href: "/drills", icon: Play },
    { label: "Insights", href: "/stats", icon: BarChart3 },
    { label: "Lab Setup", href: "/setup", icon: Settings },
  ]

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
      <nav className="glass h-20 w-full max-w-sm rounded-full flex items-center justify-around px-4 pointer-events-auto border-white/40 shadow-2xl ring-1 ring-black/5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-500",
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span className="sr-only">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1.5 w-1 h-1 bg-primary rounded-full animate-in fade-in zoom-in duration-500" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
