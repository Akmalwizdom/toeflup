import { getStudyPlan } from "@/lib/actions/study-plan";
import { getStreakStats } from "@/lib/actions/streak";
import StudyPlanGenerator from "@/components/study-plan/study-plan-generator";
import StudyPlanView from "@/components/study-plan/study-plan-view";

export default async function StudyPlanPage() {
  const plan = await getStudyPlan();
  const streakStats = await getStreakStats();

  return (
    <div className="flex-1 space-y-4">
      {!plan ? (
        <StudyPlanGenerator />
      ) : (
        <div className="space-y-4">
          <div className="px-6 pt-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">My <span className="text-primary">Roadmap</span></h1>
            <p className="text-slate-500 font-medium tracking-tight">Your personalized path to TOEFL mastery.</p>
          </div>
          <StudyPlanView plan={plan} streakStats={streakStats} />
        </div>
      )}
    </div>
  );
}
