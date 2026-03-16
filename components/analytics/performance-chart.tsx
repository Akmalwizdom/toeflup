"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreData {
  score: number;
  date: string;
}

interface PerformanceChartProps {
  data: ScoreData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  if (data.length === 0) {
    return (
       <Card className="border-2 rounded-3xl p-12 bg-slate-50 flex flex-col items-center justify-center text-center gap-4 border-dashed border-slate-200">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-50" />
          <div className="size-16 rounded-2xl bg-white flex items-center justify-center shadow-lg">
             <TrendingUp className="size-8 text-slate-300" />
          </div>
          <div className="space-y-1">
             <h4 className="font-black text-slate-800 uppercase tracking-tight italic">No Simulation Data</h4>
             <p className="text-xs text-slate-400 font-medium max-w-xs">Complete your first full simulation to see your progress trend.</p>
          </div>
       </Card>
    );
  }

  const maxScore = 120;
  const height = 200;
  const width = 600;
  const padding = 40;

  // Calculate points for the chart
  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding) / Math.max(1, data.length - 1));
    const y = height - padding - (d.score * (height - 2 * padding) / maxScore);
    return { x, y };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const firstScore = data[0].score;
  const lastScore = data[data.length - 1].score;
  const diff = lastScore - firstScore;

  return (
    <Card className="border-2 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8">
        <div className="space-y-1 text-left">
          <CardTitle className="text-2xl font-black italic tracking-tight uppercase">Mastery Trend</CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simulation scores evolution</CardDescription>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs",
          diff > 0 ? "bg-emerald-50 text-emerald-500" : diff < 0 ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-500"
        )}>
          {diff > 0 ? <TrendingUp className="size-4" /> : diff < 0 ? <TrendingDown className="size-4" /> : <Minus className="size-4" />}
          {diff > 0 ? `+${diff}` : diff} Points
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-8 px-8">
        <div className="relative h-62.5 w-full pt-4">
           {/* Chart SVG */}
           <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-full drop-shadow-[0_10px_10px_rgba(59,130,246,0.1)]"
            preserveAspectRatio="none"
           >
              {/* Grid Lines */}
              {[30, 60, 90, 120].map((s) => {
                const y = height - padding - (s * (height - 2 * padding) / maxScore);
                return (
                  <g key={s}>
                    <line 
                      x1={padding} 
                      y1={y} 
                      x2={width - padding} 
                      y2={y} 
                      stroke="currentColor" 
                      className="text-slate-100 dark:text-white/5" 
                      strokeWidth="1" 
                    />
                    <text 
                      x={padding - 10} 
                      y={y + 3} 
                      textAnchor="end" 
                      className="text-[10px] fill-slate-300 font-bold"
                    >{s}</text>
                  </g>
                );
              })}

              {/* Path */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="currentColor" 
                className="text-primary" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Points */}
              {points.map((p, i) => (
                <circle 
                  key={i} 
                  cx={p.x} 
                  cy={p.y} 
                  r="6" 
                  className="fill-white stroke-primary stroke-4" 
                />
              ))}
           </svg>

           {/* X-Axis Labels */}
           <div className="flex justify-between mt-4 px-10">
             {data.map((d, i) => (
               <span key={i} className="text-[10px] font-black text-slate-400 rotate-45 md:rotate-0">{d.date}</span>
             ))}
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
