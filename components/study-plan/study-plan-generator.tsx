"use client";

import * as React from "react";
import { 
  Calendar, 
  Clock, 
  Target, 
  ArrowRight, 
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateStudyPlan } from "@/lib/actions/study-plan";
import { cn } from "@/lib/utils";

export default function StudyPlanGenerator() {
  const [weeks, setWeeks] = React.useState(4);
  const [dailyMinutes, setDailyMinutes] = React.useState(60);
  const [level, setLevel] = React.useState("BEGINNER");
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateStudyPlan(weeks, dailyMinutes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12 px-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 font-bold text-[10px] tracking-widest uppercase">
          <Sparkles className="size-3" /> AI Study Architect
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Design Your <span className="text-primary italic">Roadmap</span> to Success
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          Tell us your goals, and we'll craft a personalized schedule to help you reach your target TOEFL score.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <Card className="border-2 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
              <Calendar className="size-32" />
           </div>
           <CardHeader className="relative z-10 pb-0">
              <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                 <Calendar className="size-6 font-bold" />
              </div>
              <CardTitle className="font-black text-xl">Preparation Window</CardTitle>
              <CardDescription className="font-medium">How many weeks until your exam?</CardDescription>
           </CardHeader>
           <CardContent className="pt-8 space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-5xl font-black tabular-nums text-slate-900 dark:text-white">{weeks}</span>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest group-hover:text-primary transition-colors">You&apos;re almost there!</p>
              </div>
              <Slider 
                value={[weeks]} 
                min={1} 
                max={12} 
                step={1} 
                onValueChange={(v: number[]) => setWeeks(v[0])}
                className="py-4"
              />
           </CardContent>
        </Card>

        <Card className="border-2 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
              <Clock className="size-32" />
           </div>
           <CardHeader className="relative z-10 pb-0">
              <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                 <Clock className="size-6 font-bold" />
              </div>
              <CardTitle className="font-black text-xl">Daily Commitment</CardTitle>
              <CardDescription className="font-medium">Study time per day?</CardDescription>
           </CardHeader>
           <CardContent className="pt-8 space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-5xl font-black tabular-nums text-slate-900 dark:text-white">{dailyMinutes}</span>
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest pb-1">Minutes</span>
              </div>
              <Slider 
                value={[dailyMinutes]} 
                min={30} 
                max={240} 
                step={15} 
                onValueChange={(v: number[]) => setDailyMinutes(v[0])}
                className="py-4"
              />
           </CardContent>
        </Card>
      </div>

      <Card className="border-2 bg-slate-900 text-white relative overflow-hidden group">
         <div className="size-full bg-linear-to-br from-primary/20 to-transparent p-8 md:p-12 flex flex-col justify-end gap-4" />
         <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-md">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Target className="size-5 text-primary" />
                  </div>
                  <h3 className="font-black text-xl italic tracking-tight">Strategy Tuning</h3>
               </div>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  We'll prioritize specific question types and difficulty levels based on your current proficiency.
               </p>
               <div className="flex gap-4">
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border-2",
                        level === l 
                          ? "bg-primary border-primary text-slate-900" 
                          : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                      )}
                    >
                      {l}
                    </button>
                  ))}
               </div>
            </div>
            
            <Button 
              size="lg" 
              className="px-12 h-16 rounded-2xl bg-primary text-black font-black text-lg gap-3 shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-6 animate-spin" />
                  Building Roadmap...
                </>
              ) : (
                <>
                  Build My Plan
                  <ArrowRight className="size-6" />
                </>
              )}
            </Button>
         </CardContent>
      </Card>
      
      <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        Safe, personalized, and data-driven learning paths
      </p>
    </div>
  );
}
