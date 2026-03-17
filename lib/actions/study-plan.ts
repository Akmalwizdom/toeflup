"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStudyPlan() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return await prisma.studyPlan.findUnique({
    where: { userId: session.user.id },
    include: {
      days: {
        orderBy: { dayNumber: "asc" },
      },
    },
  });
}

export async function generateStudyPlan(weeks: number, dailyMinutes: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Delete existing plan if any
  await prisma.studyPlan.deleteMany({
    where: { userId: session.user.id }
  });

  const totalDays = weeks * 7;
  
  // Create the base plan
  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId: session.user.id,
      weeks,
      dailyMinutes,
    },
  });

  // Generate days and tasks
  const daysData = [];
  const sections = ["READING", "LISTENING", "SPEAKING", "WRITING", "VOCAB", "GRAMMAR"];

  for (let i = 1; i <= totalDays; i++) {
    const sectionIndex = (i - 1) % sections.length;
    const section = sections[sectionIndex];
    
    let title = "";
    let tasks = [];

    if (i % 7 === 0) {
      title = `Day ${i}: Weekly Review & Full Simulation`;
      tasks = [
        { id: "sim-1", text: "Take a Full TOEFL Simulation", duration: 120, type: "SIMULATION" },
        { id: "rev-1", text: "Review incorrect answers", duration: 30, type: "REVIEW" }
      ];
    } else {
      title = `Day ${i}: ${section} Focus`;
      tasks = [
        { id: "prac-1", text: `Complete 5 ${section} questions`, duration: 20, type: "PRACTICE" },
        { id: "vocab-1", text: "Learn 10 new vocabulary words", duration: 15, type: "VOCAB" },
        { id: "rev-2", text: "Review yesterday's area", duration: 10, type: "REVIEW" }
      ];
    }

    daysData.push({
      planId: studyPlan.id,
      dayNumber: i,
      title,
      tasks,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      completedTasks: [] as any,
    });
  }

  // Batch create days
  await prisma.studyDay.createMany({
    data: daysData
  });

  revalidatePath("/study-plan");
  revalidatePath("/dashboard");
  
  return { success: true };
}

export async function toggleTaskCompletion(dayId: string, taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const studyDay = await prisma.studyDay.findUnique({
    where: { id: dayId },
  });

  if (!studyDay) throw new Error("Study day not found");

  // Cast to string[] to match updated schema (fixes out-of-sync Prisma types)
  const completedTasksStr = studyDay.completedTasks as unknown as string[];
  let newCompletedTasks = [...completedTasksStr];

  if (newCompletedTasks.includes(taskId)) {
    newCompletedTasks = newCompletedTasks.filter(id => id !== taskId);
  } else {
    newCompletedTasks.push(taskId);
  }

  await prisma.studyDay.update({
    where: { id: dayId },
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      completedTasks: newCompletedTasks as any
    }
  });

  revalidatePath("/study-plan");
  revalidatePath("/dashboard");
}
