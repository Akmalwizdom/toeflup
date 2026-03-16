import { 
  getPerformanceMetrics, 
  getScoreHistory, 
  getWeaknessAnalysis 
} from "@/lib/actions/analytics";
import { getStreakStats } from "@/lib/actions/streak";
import PerformanceChart from "@/components/analytics/performance-chart";
import SectionBreakdown from "@/components/analytics/section-breakdown";
import RecommendationCard from "@/components/analytics/recommendation-card";
import StreakDisplay from "@/components/dashboard/streak-display";
import { Sparkles, BarChart3, PieChart, Activity } from "lucide-react";

export default async function AnalyticsPage() {
  const [metrics, scoreHistory, weakness, streakStats] = await Promise.all([
    getPerformanceMetrics(),
    getScoreHistory(),
    getWeaknessAnalysis(),
    getStreakStats()
  ]);

  return (
    <div className="flex flex-col gap-10 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit font-black text-[10px] uppercase tracking-widest text-primary">
             <Sparkles className="size-3" /> Performance Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight uppercase">Your Stats</h1>
          <p className="text-slate-400 font-medium text-lg">Deep diagnostic data for your TOEFL mission.</p>
        </div>
      </div>

      {/* Hero Recommendation */}
      <RecommendationCard 
        topWeakness={weakness.topWeakness}
        weakTypes={weakness.weakTypes}
        recommendation={weakness.recommendation}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Performance Chart */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-2">
              <Activity className="size-5 text-primary" />
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Score Progress</h3>
           </div>
           <PerformanceChart data={scoreHistory} />
        </div>

        {/* Section Breakdown */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-2">
              <PieChart className="size-5 text-primary" />
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Section Mastery</h3>
           </div>
           <SectionBreakdown data={metrics.sections} />
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="space-y-6">
         <div className="flex items-center gap-3 px-2">
            <BarChart3 className="size-5 text-primary" />
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Consistency Ledger</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 border-2 rounded-3xl p-8 shadow-xl shadow-slate-200/50 overflow-x-auto">
            <StreakDisplay history={streakStats.history} />
            <div className="mt-6 flex flex-wrap gap-8">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Study Time</p>
                  <p className="text-2xl font-black italic">{Math.round(streakStats.history.reduce((acc, curr) => acc + curr.minutesStudied, 0) / 60)}h <span className="text-xs text-slate-400 not-italic">total focus</span></p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accuracy Avg</p>
                  <p className="text-2xl font-black italic text-emerald-500">
                    {metrics.sections.length > 0 
                      ? Math.round(metrics.sections.reduce((acc, curr) => acc + curr.accuracy, 0) / metrics.sections.length) 
                      : 0}%
                  </p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Questions Solved</p>
                  <p className="text-2xl font-black italic">{metrics.sections.reduce((acc, curr) => acc + curr.count, 0)} <span className="text-xs text-slate-400 not-italic">attempts</span></p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
