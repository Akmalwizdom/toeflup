"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  Flame, 
  Clock,
  ArrowUpRight,
  BrainCircuit
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    streak: number;
    accuracy: number;
    totalQuestions: number;
    studyTime: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Streak Card */}
      <Card className="border-2 bg-slate-900 text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
          <Flame className="size-16" />
        </div>
        <CardHeader className="pb-2">
           <CardTitle className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
             <Flame className="size-4" /> Daily Streak
           </CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex items-end gap-2">
              <span className="text-4xl font-black tabular-nums">{stats.streak}</span>
              <span className="text-xs font-bold text-slate-400 pb-1.5 uppercase">Days</span>
           </div>
           <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tight">Keep it up! You&apos;re in the top 5%.</p>
        </CardContent>
      </Card>

      {/* Accuracy Card */}
      <Card className="border-2 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-500/10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:-rotate-12 transition-transform">
          <Target className="size-16" />
        </div>
        <CardHeader className="pb-2 text-left">
           <CardTitle className="text-sm font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
             <Target className="size-4" /> Average Accuracy
           </CardTitle>
        </CardHeader>
        <CardContent className="text-left">
           <div className="flex items-end gap-2">
              <span className="text-4xl font-black tabular-nums text-slate-900 dark:text-white">{stats.accuracy}%</span>
              <span className="text-xs font-bold text-emerald-500 pb-1.5 flex items-center gap-0.5">
                <ArrowUpRight className="size-3" /> +2.4%
              </span>
           </div>
           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight italic">Based on last 50 questions.</p>
        </CardContent>
      </Card>

      {/* Questions Card */}
      <Card className="border-2 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-500/10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-95 transition-transform">
          <BrainCircuit className="size-16" />
        </div>
        <CardHeader className="pb-2 text-left">
           <CardTitle className="text-sm font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
             <BrainCircuit className="size-4" /> Mental Stamina
           </CardTitle>
        </CardHeader>
        <CardContent className="text-left">
           <div className="flex items-end gap-2">
              <span className="text-4xl font-black tabular-nums text-slate-900 dark:text-white">{stats.totalQuestions}</span>
              <span className="text-xs font-bold text-slate-400 pb-1.5 uppercase">Solves</span>
           </div>
           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight italic">Total questions mastered.</p>
        </CardContent>
      </Card>

      {/* Time Card */}
      <Card className="border-2 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-amber-100 dark:border-amber-500/10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
          <Clock className="size-16" />
        </div>
        <CardHeader className="pb-2 text-left">
           <CardTitle className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
             <Clock className="size-4" /> Focus Time
           </CardTitle>
        </CardHeader>
        <CardContent className="text-left">
           <div className="flex items-end gap-2">
              <span className="text-4xl font-black tabular-nums text-slate-900 dark:text-white">{Math.floor(stats.studyTime / 60)}h {stats.studyTime % 60}m</span>
           </div>
           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight italic">Deep work time this week.</p>
        </CardContent>
      </Card>
    </div>
  );
}
