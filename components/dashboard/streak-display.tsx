"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, subDays, startOfDay, isSameDay } from "date-fns";

interface StreakHistoryEntry {
  date: Date | string;
  minutesStudied: number;
}

interface StreakDisplayProps {
  history: StreakHistoryEntry[];
}

export default function StreakDisplay({ history }: StreakDisplayProps) {
  // Generate last 14 days grid
  const days = Array.from({ length: 14 }).map((_, i) => subDays(new Date(), 13 - i));

  return (
    <Card className="border-2 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
        <div className="space-y-1 text-left">
          <CardTitle className="text-lg font-black italic tracking-tight uppercase">Momentum Grid</CardTitle>
          <CardDescription className="font-medium text-[10px] uppercase tracking-widest">Consistency breakdown (Last 2 weeks)</CardDescription>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-4 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Daily activity heat map based on minutes studied.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="pt-8 flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center gap-3">
          {days.map((day, i) => {
            const dateStr = startOfDay(day);
            const entry = history.find(h => isSameDay(new Date(h.date), dateStr));
            const intensity = entry ? Math.min(Math.ceil(entry.minutesStudied / 15), 4) : 0;
            
            return (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "size-10 rounded-xl border-2 transition-all hover:scale-110",
                      intensity === 0 && "bg-slate-50 border-slate-100",
                      intensity === 1 && "bg-primary/20 border-primary/10",
                      intensity === 2 && "bg-primary/40 border-primary/20",
                      intensity === 3 && "bg-primary/70 border-primary/40",
                      intensity === 4 && "bg-primary border-primary shadow-lg shadow-primary/20"
                    )} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-black text-[10px] uppercase tracking-widest">
                      {format(day, "MMM d")}: {entry?.minutesStudied || 0}m
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        <div className="flex items-center gap-6 px-8 py-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 w-full">
           <Flame className="size-8 text-primary" />
           <div className="flex flex-col text-left">
              <h5 className="font-black italic text-lg leading-none">Fire is burning!</h5>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Study for 15 more minutes to upgrade intensity.</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
