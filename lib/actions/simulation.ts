"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SimType, SimStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { updateStreak } from "./streak";

export async function getSimulationHistory() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.simulation.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: "desc" },
  });
}

export async function startSimulation(type: SimType) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Question selection logic based on type
  const questions: Record<string, { id: string; answer: number | string | null }[]> = {};
  
  if (type === "FULL" || type === "READING") {
    const readingQs = await prisma.question.findMany({
      where: { section: "READING" },
      take: 20, 
      select: { id: true }
    });
    questions.READING = readingQs.map(q => ({ id: q.id, answer: null }));
  }
  
  if (type === "FULL" || type === "LISTENING") {
    const listeningQs = await prisma.question.findMany({
      where: { section: "LISTENING" },
      take: 15,
      select: { id: true }
    });
    questions.LISTENING = listeningQs.map(q => ({ id: q.id, answer: null }));
  }

  if (type === "FULL" || type === "SPEAKING") {
    const speakingQs = await prisma.question.findMany({
      where: { section: "SPEAKING" },
      take: 4,
      select: { id: true }
    });
    questions.SPEAKING = speakingQs.map(q => ({ id: q.id, answer: null }));
  }

  if (type === "FULL" || type === "WRITING") {
    const writingQs = await prisma.question.findMany({
      where: { section: "WRITING" },
      take: 2,
      select: { id: true }
    });
    questions.WRITING = writingQs.map(q => ({ id: q.id, answer: null }));
  }

  const simulation = await prisma.simulation.create({
    data: {
      userId: session.user.id,
      type,
      status: SimStatus.IN_PROGRESS,
      answers: questions,
    },
  });

  redirect(`/simulation/${simulation.id}`);
}

export async function getSimulation(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const simulation = await prisma.simulation.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!simulation) return null;

  // Extract all question IDs from the JSON
  const allQuestionIds: string[] = [];
  const answers = simulation.answers as Record<string, { id: string; answer: number | string | null }[]>;
  Object.keys(answers).forEach(section => {
    answers[section].forEach((q) => allQuestionIds.push(q.id));
  });

  // Fetch the actual questions
  const questions = await prisma.question.findMany({
    where: { id: { in: allQuestionIds } },
  });

  return {
    ...simulation,
    fullQuestions: questions
  };
}

export async function updateSimulationAnswer(simId: string, section: string, questionId: string, answer: number | string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const simulation = await prisma.simulation.findUnique({
    where: { id: simId, userId: session.user.id }
  });

  if (!simulation) throw new Error("Simulation not found");

  const answers = simulation.answers as Record<string, { id: string; answer: number | string | null }[]>;
  
  if (answers[section]) {
    const qIndex = answers[section].findIndex(q => q.id === questionId);
    if (qIndex !== -1) {
      answers[section][qIndex].answer = answer;
    }
  }

  return await prisma.simulation.update({
    where: { id: simId },
    data: { answers }
  });
}

export async function submitSimulation(simId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const simulation = await getSimulation(simId);
  if (!simulation) throw new Error("Simulation not found");

  let totalScore = 0;
  let readingScore = 0;
  let listeningScore = 0;

  const answers = simulation.answers as Record<string, { id: string; answer: number | string | null }[]>;
  const questions = simulation.fullQuestions;

  // Reading Score
  if (answers.READING) {
    const correctCount = answers.READING.filter(a => {
      const q = questions.find(q => q.id === a.id);
      return q && q.correctAnswer === a.answer;
    }).length;
    readingScore = Math.round((correctCount / answers.READING.length) * 30) || 0;
  }

  // Listening Score
  if (answers.LISTENING) {
    const correctCount = answers.LISTENING.filter(a => {
      const q = questions.find(q => q.id === a.id);
      return q && q.correctAnswer === a.answer;
    }).length;
    listeningScore = Math.round((correctCount / answers.LISTENING.length) * 30) || 0;
  }

  // For Speaking & Writing, we currently set a placeholder or use a simple logic
  // AI-Powered scoring can be added here later
  const speakingScore = answers.SPEAKING ? 20 : 0; 
  const writingScore = answers.WRITING ? 22 : 0;

  totalScore = readingScore + listeningScore + speakingScore + writingScore;

  await prisma.simulation.update({
    where: { id: simId },
    data: {
      status: SimStatus.COMPLETED,
      readingScore,
      listeningScore,
      speakingScore,
      writingScore,
      totalScore,
      completedAt: new Date(),
    }
  });

  // Update streak (Full simulation is long, but we'll cap it or use actual elapsed time)
  // For now, let's assume a full simulation adds 120 minutes of focus time
  const focusMinutes = simulation.type === "FULL" ? 120 : 30;
  await updateStreak(focusMinutes);

  return { success: true, score: totalScore };
}
