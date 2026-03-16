"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateStreak } from "./streak";

interface SubmitQuestion {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export async function submitPracticeSession(questions: SubmitQuestion[]) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    // Save all attempts in a transaction
    await prisma.$transaction(
      questions.map((q) =>
        prisma.practiceAttempt.create({
          data: {
            userId: userId,
            questionId: q.questionId,
            selectedAnswer: q.selectedAnswer,
            isCorrect: q.isCorrect,
            timeSpent: q.timeSpent,
          },
        })
      )
    );

    // Update streak based on time spent
    const totalMinutes = Math.max(1, Math.round(questions.reduce((acc, q) => acc + q.timeSpent, 0) / 60));
    await updateStreak(totalMinutes);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to save practice session:", error);
    return { success: false, error: "Failed to save session" };
  }
}
