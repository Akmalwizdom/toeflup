import { auth } from "@/auth";
import { getSimulation } from "@/lib/actions/simulation";
import { redirect, notFound } from "next/navigation";
import SimulationPlayer from "@/components/simulation/simulation-player";

export default async function SimulationActivePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const simulation = await getSimulation(id);

  if (!simulation) {
    notFound();
  }

  // If already completed, redirect to results (to be implemented)
  if (simulation.status === "COMPLETED") {
    redirect(`/simulation/${id}/results`);
  }

  return (
    <div className="h-[calc(100vh-4rem)] -m-8 overflow-hidden">
      <SimulationPlayer simulation={simulation as any} />
    </div>
  );
}
