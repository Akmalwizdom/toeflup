import { auth } from "@/auth";
import { getSimulation } from "@/lib/actions/simulation";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  ArrowRight, 
  BookOpen,
  Headphones,
  Mic2,
  PenTool,
  TrendingUp,
  Award,
  Layout
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SimStatus } from "@prisma/client";

export default async function SimulationResultsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const simulation = await getSimulation(id);

  if (!simulation || simulation.status !== SimStatus.COMPLETED) {
    notFound();
  }

  const sections = [
    { name: "Reading", score: simulation.readingScore || 0, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Listening", score: simulation.listeningScore || 0, icon: Headphones, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Speaking", score: simulation.speakingScore || 0, icon: Mic2, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Writing", score: simulation.writingScore || 0, icon: PenTool, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Result Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
          <Trophy className="size-64" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          <div className="size-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mb-2">
            <Award className="size-12 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight italic uppercase text-white">Test Completed!</h1>
            <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">Detailed Score Breakdown</p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-3xl backdrop-blur-md mt-4">
             <div className="px-10 py-6 text-center border-r border-white/10">
                <div className="text-6xl font-black tabular-nums tracking-tighter text-white">{simulation.totalScore}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Total Score</div>
             </div>
             <div className="px-10 py-6 text-center">
                <div className="text-2xl font-black text-primary italic">Excellent</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Status</div>
             </div>
          </div>
        </div>
      </div>

      {/* Section Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.name} className="border-2 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-4 text-left">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center", section.bg, section.color)}>
                  <section.icon className="size-6" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-xl font-black">{section.name}</CardTitle>
                  <CardDescription className="font-bold text-xs uppercase tracking-widest">Section Performance</CardDescription>
                </div>
              </div>
              <div className="text-2xl font-black tracking-tighter">
                {section.score}<span className="text-xs text-slate-300 font-bold ml-1">/30</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-left">
                <Progress value={(section.score / 30) * 100} className="h-3 rounded-full" />
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Proficiency</span>
                  <span>{Math.round((section.score / 30) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis / Next Steps */}
      <Card className="border-2 rounded-4xl shadow-xl shadow-slate-200/50 overflow-hidden bg-slate-50/50">
        <CardHeader className="p-8 border-b-2 border-white text-left">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
              <TrendingUp className="size-5" />
            </div>
            Improvement Plan
          </CardTitle>
          <CardDescription className="text-base font-medium">Based on your performance, we recommend focusing on these areas.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6 text-left">
          <div className="grid gap-4">
            <div className="bg-white p-6 rounded-2xl border-2 flex items-start gap-5 hover:border-primary/20 transition-colors">
              <div className="size-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <BookOpen className="size-6" />
              </div>
              <div className="text-left">
                <h4 className="font-black text-lg">Enhance Academic Vocabulary</h4>
                <p className="text-slate-500 font-medium text-sm mt-1">Practice vocabulary bank daily to improve your score.</p>
                <Button variant="link" className="p-0 h-auto font-black text-primary text-xs uppercase tracking-widest mt-4" asChild>
                   <Link href="/vocabulary">Go to Vocabulary Bank <ArrowRight className="size-3 ml-1" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button className="flex-1 py-8 rounded-2xl font-black text-lg gap-3 shadow-2xl shadow-primary/20" asChild>
          <Link href="/simulation">
            <Layout className="size-5" /> Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" className="flex-1 py-8 rounded-2xl font-black text-lg gap-3 border-2" asChild>
          <Link href="/practice">
            <TrendingUp className="size-5" /> Practice Weak Areas
          </Link>
        </Button>
      </div>
    </div>
  );
}
