"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  Languages, 
  Timer, 
  CalendarDays, 
  BarChart3, 
  Settings,
  Flame,
  Target,
  BrainCircuit,
  Clock,
  Sparkles,
  ArrowRight,
  Headphones
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Practice", icon: BookOpen },
  { name: "Vocabulary", icon: Languages },
  { name: "Simulation", icon: Timer },
  { name: "Study Plan", icon: CalendarDays },
  { name: "Analytics", icon: BarChart3 },
];

export function DashboardMockup() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-muted/20 text-left">
      {/* Sidebar Mockup */}
      <div className="hidden h-full w-48 flex-col border-r bg-card shadow-sm md:flex lg:w-56">
        <div className="flex h-12 items-center px-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary flex items-center justify-center">
              <span className="text-[10px] text-primary-foreground font-bold font-mono">T</span>
            </div>
            <span className="text-sm font-bold tracking-tight">Toeflup</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2">
          <nav className="space-y-0.5 flex flex-col">
            {navigation.map((item) => (
              <div
                key={item.name}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] font-medium transition-all cursor-default",
                  item.active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("size-3.5 shrink-0", item.active ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </div>
            ))}
          </nav>
        </div>
        <div className="border-t p-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-2 py-1 text-[10px] text-muted-foreground cursor-default">
              <Settings className="size-3.5" />
              Settings
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Mockup */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 items-center border-b bg-background px-6">
          <div className="ml-auto flex items-center gap-2">
             <div className="size-6 rounded-full bg-zinc-200" />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                  Welcome Back, <span className="text-primary">Scholar</span>!
                </h1>
                <p className="text-[10px] text-slate-500 font-medium italic">Your path to TOEFL mastery is 24% complete. Keep pushing.</p>
              </div>
              <div className="flex items-center gap-2 scale-75 lg:scale-90 origin-right">
                 <Button variant="outline" className="rounded-lg font-bold border-2 h-8 px-3 text-xs">
                   Quick Practice
                 </Button>
                 <Button className="rounded-lg font-black bg-primary text-primary-foreground shadow-lg shadow-primary/20 gap-1.5 h-8 px-3 text-xs">
                   <Timer className="size-3" /> Start Simulation
                 </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Daily Streak", value: "0", sub: "Days", icon: Flame, color: "text-primary", bg: "bg-slate-900 text-white" },
                { label: "Average Accuracy", value: "0%", sub: "+2.4%", icon: Target, color: "text-emerald-500", bg: "bg-white" },
                { label: "Mental Stamina", value: "0", sub: "Solves", icon: BrainCircuit, color: "text-indigo-500", bg: "bg-white" },
                { label: "Focus Time", value: "0h 0m", sub: "", icon: Clock, color: "text-amber-500", bg: "bg-white" },
              ].map((stat, i) => (
                <Card key={i} className={cn("border bg-white p-3 relative overflow-hidden group", stat.bg)}>
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <stat.icon className="size-8" />
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1 mb-1">
                    <stat.icon className={cn("size-2.5", stat.color)} />
                    {stat.label}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-lg font-black">{stat.value}</span>
                    <span className="text-[6px] font-bold opacity-50 pb-0.5 uppercase">{stat.sub}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Big Card & Smaller ones */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 space-y-4">
                <Card className="border p-4 bg-white relative overflow-hidden group shadow-md">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Sparkles className="size-24 text-primary" />
                   </div>
                   <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 w-fit font-black text-[8px] uppercase tracking-widest mb-2">
                     <Sparkles className="size-2" /> Personalized Goal
                   </div>
                   <h3 className="text-lg font-black text-slate-900">Next Target: <span className="text-primary italic">Generate Plan</span></h3>
                   <p className="text-[10px] font-medium text-slate-500 mt-1">Ready to get serious? Generate a data-driven study plan to skyrocket your score.</p>
                   
                   <Button size="sm" className="mt-4 rounded-xl font-black bg-primary text-primary-foreground gap-2 h-9 px-4 text-xs">
                     Create My Roadmap
                     <ArrowRight className="size-3" />
                   </Button>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Master Reading", desc: "Passage Analysis", icon: BookOpen, color: "bg-blue-500" },
                    { label: "Sharpen Listening", desc: "Lecture Flow", icon: Headphones, color: "bg-purple-500" },
                  ].map((item, i) => (
                    <Card key={i} className="border p-3 flex items-center gap-3 bg-white">
                      <div className={cn("size-8 rounded-lg flex items-center justify-center text-white", item.color)}>
                        <item.icon className="size-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-black text-[10px] uppercase">{item.label}</h4>
                        <p className="text-[8px] text-slate-400">{item.desc}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <Card className="border p-4 bg-slate-50 relative overflow-hidden group border-transparent">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <div className="space-y-2">
                    <h4 className="font-black italic text-xs text-slate-900">Expert Evaluation</h4>
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                      &quot;Your Reading scores have improved by 15% in the last 7 days. We recommend shifting focus to Listening...&quot;
                    </p>
                    <div className="text-[8px] font-black text-primary uppercase tracking-widest flex items-center gap-1 pt-1">
                      Full Performance Report <ArrowRight className="size-2" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
