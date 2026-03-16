"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, BrainCircuit, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RecommendationProps {
  topWeakness: string;
  weakTypes: string[];
  recommendation: string;
}

export default function RecommendationCard({ topWeakness, weakTypes, recommendation }: RecommendationProps) {
  return (
    <Card className="border-2 rounded-3xl bg-slate-900 text-white overflow-hidden relative group">
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-50" />
      <div className="absolute top-0 right-0 p-12 opacity-5 -translate-y-4 translate-x-4 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform">
         <Sparkles className="size-48" />
      </div>
      <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="size-24 md:size-32 rounded-4xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
           <BrainCircuit className="size-12 md:size-16 text-primary animate-pulse" />
        </div>
        
        <div className="flex-1 space-y-6 text-center md:text-left">
           <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit font-black text-[10px] uppercase tracking-widest text-primary">
                 <Lightbulb className="size-3" /> Focus Strategy
              </div>
              <h3 className="text-3xl font-black italic tracking-tight">AI Diagnostic Report</h3>
           </div>
           
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
             {recommendation}
           </p>

           <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {weakTypes.map(t => (
                <div key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">
                   {t}
                </div>
              ))}
           </div>

           <Button className="h-14 px-8 rounded-2xl bg-primary text-black font-black text-lg gap-3 shadow-2xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
              <Link href={`/practice/${topWeakness.toLowerCase()}`}>
                 Attack Your Weakness
                 <ArrowRight className="size-5" />
              </Link>
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}
