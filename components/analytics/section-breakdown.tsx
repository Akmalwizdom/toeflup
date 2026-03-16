"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionData {
  name: string;
  accuracy: number;
  count: number;
}

interface SectionBreakdownProps {
  data: SectionData[];
}

export default function SectionBreakdown({ data }: SectionBreakdownProps) {
  return (
    <Card className="border-2 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50">
      <CardHeader className="p-8 pb-4">
        <h2 className="text-2xl font-black italic tracking-tight uppercase">Section Mastery</h2>
        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accuracy breakdown per category</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0 space-y-8">
        {data.map((s) => (
          <div key={s.name} className="space-y-3 group cursor-default">
            <div className="flex justify-between items-end">
               <div className="flex items-center gap-3">
                  <div className={cn(
                    "size-4 rounded-full",
                    s.accuracy > 70 ? "bg-emerald-500" : s.accuracy > 40 ? "bg-amber-500" : "bg-rose-500"
                  )} />
                  <span className="font-black text-slate-700 dark:text-slate-200 uppercase text-xs tracking-tight">{s.name}</span>
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.count} Attempts</span>
                  <span className={cn(
                    "font-black text-sm",
                    s.accuracy > 70 ? "text-emerald-500" : s.accuracy > 40 ? "text-amber-500" : "text-rose-500"
                  )}>{s.accuracy}%</span>
               </div>
            </div>
            <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden border">
                <div 
                  className={cn(
                    "h-full transition-all duration-700",
                    s.accuracy > 70 ? "bg-emerald-500" : s.accuracy > 40 ? "bg-amber-500" : "bg-rose-500"
                  )} 
                  style={{ width: `${s.accuracy}%` }} 
                />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
