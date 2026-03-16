import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { getStreakStats } from "@/lib/actions/streak";
import { getStudyPlan } from "@/lib/actions/study-plan";
import StatsCards from "@/components/dashboard/stats-cards";
import StreakDisplay from "@/components/dashboard/streak-display";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, Timer, Headphones } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();
  const streakStats = await getStreakStats();
  const studyPlan = await getStudyPlan();

  // Find today's tasks from study plan
  const nextTargetDay = studyPlan?.days.find((d: any) => {
    const completed = Array.isArray(d.completedTasks) ? d.completedTasks : [];
    const tasks = Array.isArray(d.tasks) ? d.tasks : [];
    return completed.length < tasks.length;
  }) as { title: string; tasks: any[]; completedTasks: any[] } | undefined;

  return (
    <div className="flex-1 space-y-10 p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
            Welcome Back, <span className="text-primary">{session?.user?.name?.split(' ')[0] || "Scholar"}</span>!
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Your path to TOEFL mastery is 24% complete. Keep pushing.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl font-bold border-2" asChild>
             <Link href="/practice">Quick Practice</Link>
           </Button>
           <Button className="rounded-xl font-black bg-primary text-black shadow-lg shadow-primary/20 gap-2" asChild>
             <Link href="/simulation">
               <Timer className="size-4" /> Start Simulation
             </Link>
           </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsCards 
        stats={{
          streak: streakStats.currentStreak,
          accuracy: stats.accuracy,
          totalQuestions: stats.totalQuestions,
          studyTime: stats.studyTime
        }} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        {/* Left: Study Plan Call-to-Action */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-2 rounded-3xl overflow-hidden relative group bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/40">
            <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-6 group-hover:rotate-0 transition-transform">
               <Sparkles className="size-48 text-primary" />
            </div>
            <CardHeader className="p-8 pb-0">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 w-fit font-black text-[10px] uppercase tracking-widest mb-4">
                 <Sparkles className="size-3" /> Personalized Goal
               </div>
               <CardTitle className="text-3xl font-black text-slate-900 dark:text-white">Next Target: <span className="text-primary italic">{nextTargetDay ? nextTargetDay.title.split(':')[1] || "Full Potential" : "Generate Plan"}</span></CardTitle>
                <CardDescription className="text-lg font-medium text-slate-500 mt-2">
                  {nextTargetDay 
                    ? `You&apos;ve completed ${Array.isArray(nextTargetDay.completedTasks) ? nextTargetDay.completedTasks.length : 0} out of ${Array.isArray(nextTargetDay.tasks) ? nextTargetDay.tasks.length : 0} tasks for today.`
                    : "Ready to get serious? Generate a data-driven study plan to skyrocket your score."}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-10">
               {nextTargetDay ? (
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                       <span>Daily Progress</span>
                       <span>{Math.round(((nextTargetDay?.completedTasks?.length || 0) / (nextTargetDay?.tasks?.length || 1)) * 100)}%</span>
                    </div>
                     <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border">
                        <div 
                         className="h-full bg-linear-to-r from-primary to-primary/80 transition-all duration-1000 ease-out" 
                         style={{ 
                           width: `${((nextTargetDay?.completedTasks?.length || 0) / (nextTargetDay?.tasks?.length || 1)) * 100}%` 
                         }} 
                        />
                     </div>
                    <Button size="lg" className="w-full mt-6 h-14 rounded-2xl font-black bg-slate-900 text-white gap-3 shadow-xl hover:scale-[1.02] transition-transform" asChild>
                       <Link href="/study-plan">
                         Jump Back Into Flow
                       </Link>
                    </Button>
                 </div>
               ) : (
                 <Button size="lg" className="px-12 h-14 rounded-2xl font-black bg-primary text-black gap-3 shadow-xl shadow-primary/20" asChild>
                   <Link href="/study-plan">
                     Create My Roadmap
                     <ArrowRight className="size-5" />
                   </Link>
                 </Button>
               )}
            </CardContent>
          </Card>

          {/* Quick Practice Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: "READING", label: "Master Reading", desc: "Passage Analysis & Inference", icon: BookOpen, color: "bg-blue-500" },
              { id: "LISTENING", label: "Sharpen Listening", desc: "Lecture & Conversation Flow", icon: Headphones, color: "bg-purple-500" },
            ].map((s) => (
              <Link key={s.id} href={`/practice/${s.id.toLowerCase()}`} className="group">
                <Card className="border-2 rounded-3xl p-6 transition-all hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/5 h-full">
                  <div className="flex items-center gap-4">
                    <div className={cn("size-12 rounded-2xl flex items-center justify-center text-white shadow-lg", s.color)}>
                       <s.icon className="size-6" />
                    </div>
                    <div className="flex flex-col text-left">
                       <h4 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-tight">{s.label}</h4>
                       <p className="text-[10px] font-bold text-slate-400 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Streak & Progress */}
        <div className="lg:col-span-4 space-y-6">
          <StreakDisplay history={streakStats.history} />
          
          <Card className="border-2 rounded-3xl p-8 bg-slate-50 dark:bg-slate-900/50 border-transparent text-left relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="relative z-10 space-y-4">
              <h4 className="font-black italic text-slate-900 dark:text-white">Expert Evaluation</h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                &quot;Your Reading scores have improved by 15% in the last 7 days. We recommend shifting focus to **Listening** for the next 48 hours to balance your profile.&quot;
              </p>
              <Button variant="link" className="p-0 h-auto font-black text-xs text-primary uppercase tracking-widest gap-1 group-hover:gap-2 transition-all" asChild>
                <Link href="/analytics">
                  Full Performance Report <ArrowRight className="size-3" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
