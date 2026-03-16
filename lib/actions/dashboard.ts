"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) return { accuracy: 0, totalQuestions: 0, studyTime: 0 };

  const userId = session.user.id;

  const practiceAttempts = await prisma.practiceAttempt.findMany({
    where: { userId },
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  const correctCount = practiceAttempts.filter((a) => a.isCorrect).length;
  const accuracy = practiceAttempts.length > 0 ? Math.round((correctCount / practiceAttempts.length) * 100) : 0;

  const totalQuestions = await prisma.practiceAttempt.count({ where: { userId } });

  const recentStreaks = await prisma.streak.findMany({
    where: { 
      userId,
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7))
      }
    }
  });

  const studyTime = recentStreaks.reduce((acc, s) => acc + s.minutesStudied, 0);

  return {
    accuracy,
    totalQuestions,
    studyTime,
  };
}
