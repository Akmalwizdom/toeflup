"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { startOfDay, subDays, format } from "date-fns";

export async function getPerformanceMetrics() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Aggregate stats per section
  const sectionStats = await prisma.practiceAttempt.groupBy({
    by: ["userId"],
    where: { userId },
    _count: {
      id: true,
    },
    // Note: Prisma groupBy doesn't directly support joining forGrouping in simple way
    // We'll fetch attempts with question info and aggregate in JS for more flexibility
  });

  const attempts = await prisma.practiceAttempt.findMany({
    where: { userId },
    include: {
      question: {
        select: {
          section: true,
          type: true,
        }
      }
    }
  });

  const aggregation: Record<string, { total: number; correct: number }> = {};
  const typeAggregation: Record<string, { total: number; correct: number }> = {};

  attempts.forEach(a => {
    const section = a.question.section;
    const type = a.question.type;

    if (!aggregation[section]) aggregation[section] = { total: 0, correct: 0 };
    aggregation[section].total++;
    if (a.isCorrect) aggregation[section].correct++;

    if (!typeAggregation[type]) typeAggregation[type] = { total: 0, correct: 0 };
    typeAggregation[type].total++;
    if (a.isCorrect) typeAggregation[type].correct++;
  });

  return {
    sections: Object.entries(aggregation).map(([name, stats]) => ({
      name,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      count: stats.total
    })),
    types: Object.entries(typeAggregation).map(([name, stats]) => ({
      name,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      count: stats.total
    }))
  };
}

export async function getScoreHistory() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const simulations = await prisma.simulation.findMany({
    where: { 
      userId,
      status: "COMPLETED",
      type: "FULL"
    },
    orderBy: { completedAt: "asc" },
    select: {
      totalScore: true,
      completedAt: true,
    }
  });

  return simulations.map(s => ({
    score: s.totalScore || 0,
    date: s.completedAt ? format(new Date(s.completedAt), "MMM d") : "N/A"
  }));
}

export async function getWeaknessAnalysis() {
  const metrics = await getPerformanceMetrics();
  
  // Sort sections by accuracy (ascending)
  const weakSections = [...metrics.sections].sort((a, b) => a.accuracy - b.accuracy);
  const weakTypes = [...metrics.types].sort((a, b) => a.accuracy - b.accuracy);

  return {
    topWeakness: weakSections[0]?.name || "None",
    weakTypes: weakTypes.slice(0, 3).map(t => t.name),
    recommendation: weakSections[0] 
      ? `Your ${weakSections[0].name} accuracy is ${weakSections[0].accuracy}%. Focus on these specific question types: ${weakTypes.slice(0, 2).map(t => t.name).join(', ')}.`
      : "Keep practicing to get more insights into your performance!"
  };
}
