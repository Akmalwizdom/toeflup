"use client";

import * as React from "react";
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  TrendingUp, 
  Trophy,
  Flame,
  ArrowRight,
  BookOpen,
  Headphones,
  Mic2,
  PenTool,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toggleTaskCompletion } from "@/lib/actions/study-plan";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface StudyPlanViewProps {
  plan: any;
  streakStats: {
    currentStreak: number;
    lastStudied: Date | null;
  };
}

export default function StudyPlanView({ plan, streakStats }: StudyPlanViewProps) {
  const [activeDayIndex, setActiveDayIndex] = React.useState(0);
  const activeDay = plan.days[activeDayIndex];

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTaskCompletion(activeDay.id, taskId);
    } catch (error) {
      console.error(error);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "PRACTICE": return BookOpen;
      case "VOCAB": return Trophy;
      case "SIMULATION": return TrendingUp;
      case "REVIEW": return Clock;
      default: return Calendar;
    }
  };

  const dayProgress = activeDay 
    ? (activeDay.completedTasks.length / (activeDay.tasks as any[]).length) * 100 
    : 0;

  const overallProgress = (plan.days.reduce((acc: number, day: any) => acc + day.completedTasks.length, 0) / 
    plan.days.reduce((acc: number, day: any) => acc + (day.tasks as any[]).length, 0)) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 px-6">
      {/* Left Rail: Daily Navigation */}
      <aside className="lg:col-span-3 space-y-6">
        <Card className="border-2 bg-slate-900 text-white p-6 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Flame className="size-16" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4 py-4">
             <div className="size-20 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Flame className="size-10 text-primary animate-pulse" />
             </div>
             <div className="text-center">
                <h4 className="text-4xl font-black">{streakStats.currentStreak}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Day Streak</p>
             </div>
          </div>
        </Card>

        <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Roadmap Progress</h3>
              <span className="font-black text-xs text-primary">{Math.round(overallProgress)}%</span>
           </div>
           <Progress value={overallProgress} className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>

        <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar">
           {plan.days.map((day: any, idx: number) => (
             <button
               key={day.id}
               onClick={() => setActiveDayIndex(idx)}
               className={cn(
                 "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all group",
                 activeDayIndex === idx 
                   ? "bg-white dark:bg-slate-800 border-primary shadow-lg shadow-primary/5" 
                   : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"
               )}
             >
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "size-8 rounded-lg flex items-center justify-center font-black text-xs",
                     idx <= activeDayIndex ? "bg-primary text-black" : "bg-slate-200 text-slate-400"
                   )}>
                     {idx + 1}
                   </div>
                   <div className="flex flex-col text-left">
                      <span className={cn("text-xs font-black", activeDayIndex === idx ? "text-slate-900 dark:text-white" : "text-slate-500")}>
                        Day {day.dayNumber}
                      </span>
                      {day.completedTasks.length === (day.tasks as any[]).length && (
                        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 className="size-2" /> Completed
                        </span>
                      )}
                   </div>
                </div>
                {activeDayIndex === idx && <ArrowRight className="size-4 text-primary" />}
             </button>
           ))}
        </div>
      </aside>

      {/* Main Panel: Active Day Tasks */}
      <main className="lg:col-span-6 space-y-8">
         <div className="space-y-2">
            <Badge className="bg-primary/5 text-primary border-primary/10 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-2">
              {activeDay.completedTasks.length} / {(activeDay.tasks as any[]).length} Tasks Complete
            </Badge>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">{activeDay.title}</h2>
            <p className="text-slate-500 font-medium italic text-lg">{activeDay.dayNumber % 7 === 0 ? "Moment of truth. Test your limits." : "Consistency is the key to mastery."}</p>
         </div>

         <div className="space-y-4">
            {(activeDay.tasks as any[]).map((task: any) => {
               const isCompleted = activeDay.completedTasks.includes(task.id);
               const Icon = getTaskIcon(task.type);
               return (
                 <Card 
                   key={task.id} 
                   className={cn(
                     "border-2 rounded-3xl transition-all duration-300 group overflow-hidden relative cursor-pointer",
                     isCompleted ? "bg-emerald-50/30 border-emerald-100 opacity-75" : "bg-white dark:bg-slate-900 border-slate-100 hover:border-primary/30 shadow-xl shadow-slate-200/50"
                   )}
                   onClick={() => handleToggleTask(task.id)}
                 >
                   {isCompleted && <div className="absolute top-0 right-0 p-4"><CheckCircle2 className="size-6 text-emerald-500" /></div>}
                   <CardContent className="p-8 flex items-center gap-6">
                      <div className={cn(
                        "size-16 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                        isCompleted ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary"
                      )}>
                         <Icon className="size-8" />
                      </div>
                      <div className="flex-1 space-y-1">
                         <div className="flex flex-col">
                            <h4 className={cn("text-xl font-black", isCompleted ? "text-slate-500 line-through" : "text-slate-800 dark:text-white")}>
                              {task.text}
                            </h4>
                            <div className="flex items-center gap-4 mt-2">
                               <div className="flex items-center gap-1.5">
                                 <Clock className="size-3 text-slate-400" />
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{task.duration} Minutes</span>
                               </div>
                               <Badge variant="secondary" className="bg-slate-100 text-slate-400 font-black text-[8px] uppercase px-2 py-0 border-0">{task.type}</Badge>
                            </div>
                         </div>
                      </div>
                      {!isCompleted && (
                        <div className="size-10 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-primary transition-colors">
                           <div className="size-6 rounded-full bg-slate-50" />
                        </div>
                      )}
                   </CardContent>
                 </Card>
               );
            })}
         </div>

         {/* Motivational Footer */}
         <Card className="bg-slate-50 border-0 rounded-3xl p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <Trophy className="size-12 text-amber-500" />
               <div className="space-y-1 text-left">
                  <h5 className="font-black text-slate-800">You're doing great!</h5>
                  <p className="text-xs text-slate-500 font-medium">Keep this momentum to boost your estimated score by +5 points.</p>
               </div>
            </div>
            <Button className="rounded-xl font-black px-6 shadow-lg shadow-primary/20">Resume Last Practice</Button>
         </Card>
      </main>

      {/* Right Rail: Stats & Social */}
      <aside className="lg:col-span-3 space-y-8">
         <Card className="border-2 rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50">
            <CardHeader className="p-0 mb-6">
               <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Section mastery</h3>
            </CardHeader>
            <div className="space-y-6">
               {[
                 { label: "Reading", val: 65, color: "bg-blue-500" },
                 { label: "Listening", val: 40, color: "bg-purple-500" },
                 { label: "Speaking", val: 20, color: "bg-amber-500" },
                 { label: "Writing", val: 35, color: "bg-rose-500" },
               ].map((s) => (
                 <div key={s.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                       <span>{s.label}</span>
                       <span>{s.val}%</span>
                    </div>
                    <Progress value={s.val} className={cn("h-1.5", s.color)} />
                 </div>
               ))}
            </div>
         </Card>

         <Card className="border-2 rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 group overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center text-center gap-4 relative z-10 px-2">
               <Badge className="bg-emerald-500/10 text-emerald-500 border-0 font-black tracking-widest text-[8px] uppercase px-4 py-1.5">Expert Tip</Badge>
               <p className="text-sm font-bold leading-relaxed text-slate-700 dark:text-slate-300">
                 "Active recall is better than re-reading. Test yourself frequently to solidify memory."
               </p>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">— TOeflUp Bot</span>
            </div>
         </Card>
      </aside>
    </div>
  );
}
