import { auth } from "@/auth";
import { getSimulationHistory, startSimulation } from "@/lib/actions/simulation";
import { SimType } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  History, 
  Trophy, 
  Timer, 
  BookOpen, 
  Headphones, 
  Mic2, 
  PenTool,
  Clock
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

export default async function SimulationPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const history = await getSimulationHistory();

  const stats = {
    total: history.length,
    completed: history.filter(s => s.status === "COMPLETED").length,
    avgScore: history.length > 0 
      ? Math.round(history.reduce((acc, s) => acc + (s.totalScore || 0), 0) / history.length) 
      : 0,
    bestScore: history.length > 0 ? Math.max(...history.map(s => s.totalScore || 0)) : 0
  };

  const simOptions = [
    { 
      type: "FULL", 
      title: "Full Simulation", 
      desc: "Experience the complete TOEFL iBT (2 hours)", 
      icon: Trophy, 
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    { 
      type: "READING", 
      title: "Reading Section", 
      desc: "35 minutes • 2 passages", 
      icon: BookOpen, 
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      type: "LISTENING", 
      title: "Listening Section", 
      desc: "36 minutes • 5 tasks", 
      icon: Headphones, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      type: "SPEAKING", 
      title: "Speaking Section", 
      desc: "16 minutes • 4 tasks", 
      icon: Mic2, 
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    { 
      type: "WRITING", 
      title: "Writing Section", 
      desc: "29 minutes • 2 tasks", 
      icon: PenTool, 
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent uppercase italic">
            Simulation Test
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Simulate the real TOEFL exam experience and track your progress.
          </p>
        </div>
        <Button variant="outline" className="gap-2 border-2" asChild>
          <Link href="/practice">
            <BookOpen className="size-4" /> Go to Practice
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-colors shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-bold flex items-center justify-between">
              Total Attempts <History className="size-4 opacity-50" />
            </CardDescription>
            <CardTitle className="text-3xl font-black">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-bold flex items-center justify-between">
              Completed <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/20">Done</Badge>
            </CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 transition-colors shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-bold flex items-center justify-between">
              Best Score <Trophy className="size-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-black text-amber-500">{stats.bestScore}/120</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 transition-colors shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-bold flex items-center justify-between">
              Avg Score <Timer className="size-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-black text-blue-500">{stats.avgScore}/120</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
            <span className="bg-primary text-primary-foreground size-8 rounded-lg flex items-center justify-center italic">S</span>
            Start New Simulation
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simOptions.map((opt) => (
            <Card key={opt.type} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 border-transparent hover:border-primary/20 relative overflow-hidden bg-white dark:bg-slate-950">
              <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all duration-500 scale-125 group-hover:scale-150 rotate-12`}>
                <opt.icon className="size-32" />
              </div>
              <CardHeader className="relative z-10">
                <div className={`size-14 rounded-2xl ${opt.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <opt.icon className={`size-7 ${opt.color}`} />
                </div>
                <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors tracking-tight">
                  {opt.title}
                </CardTitle>
                <CardDescription className="text-base font-medium text-slate-500 dark:text-slate-400">
                  {opt.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <form action={async () => {
                  "use server";
                  await startSimulation(opt.type as SimType);
                }}>
                  <Button className="w-full gap-3 py-6 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                    <Play className="size-5 fill-current" /> Launch Test
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
          <span className="bg-slate-100 dark:bg-slate-800 size-8 rounded-lg flex items-center justify-center italic text-slate-500">H</span>
          History & Analytics
        </h2>
        <Card className="border-2 shadow-xl shadow-slate-200/50 dark:shadow-none bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="p-0">
            {history.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <div className="size-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mb-2">
                  <Clock className="size-10 text-slate-300 dark:text-slate-600 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black">Ready for your first test?</h3>
                  <p className="text-slate-500 font-medium">Your simulation results and detailed performance analysis will appear here.</p>
                </div>
                <Button variant="secondary" className="mt-4 font-bold rounded-lg border-2">Let&apos;s Get Started</Button>
              </div>
            ) : (
              <div className="divide-y-2 divide-slate-100 dark:divide-slate-800">
                {history.map((sim) => (
                  <div key={sim.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 gap-4">
                    <div className="flex gap-5 items-center">
                      <div className={`size-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform ${
                        sim.type === "FULL" ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
                      }`}>
                        <Timer className="size-7" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-black text-xl flex items-center gap-3 tracking-tight">
                          {sim.type} Simulation
                          <Badge 
                            className={`font-black text-[10px] tracking-widest uppercase py-1 px-3 rounded-full border-2 ${
                              sim.status === "COMPLETED" 
                                ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:border-emerald-900" 
                                : "bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-950 dark:border-blue-900"
                            }`}
                          >
                            {sim.status}
                          </Badge>
                        </div>
                        <div className="text-sm font-bold text-slate-400 flex items-center gap-2">
                          <Clock className="size-3" /> {format(new Date(sim.startedAt), "MMMM d, yyyy • hh:mm a")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 self-end sm:self-center">
                      {sim.status === "COMPLETED" && (
                        <div className="text-right">
                          <div className="text-3xl font-black text-primary tracking-tighter tabular-nums">{sim.totalScore}<span className="text-base text-slate-300 font-bold ml-1">/120</span></div>
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Overall Score</div>
                        </div>
                      )}
                      <Button variant="ghost" className="font-black border-2 hover:bg-primary hover:text-white transition-all rounded-xl px-6 group" asChild>
                        <Link href={`/simulation/${sim.id}`} className="flex items-center gap-2">
                          {sim.status === "COMPLETED" ? "Review" : "Resume"}
                          <Play className="size-4 fill-current group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
