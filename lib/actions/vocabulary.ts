"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { VocabStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateVocabStatus(vocabId: string, status: VocabStatus) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const userId = session.user.id;

    // SM-2 algorithm basics (simplified for now)
    // In a real implementation, we would calculate nextReviewAt based on status and repetitions
    const nextReviewAt = new Date();
    if (status === "MASTERED") {
      nextReviewAt.setDate(nextReviewAt.getDate() + 7);
    } else {
      nextReviewAt.setDate(nextReviewAt.getDate() + 1);
    }

    await prisma.vocabProgress.upsert({
      where: {
        userId_vocabId: {
          userId,
          vocabId,
        },
      },
      update: {
        status,
        nextReviewAt,
        updatedAt: new Date(),
      },
      create: {
        userId,
        vocabId,
        status,
        nextReviewAt,
      },
    });

    revalidatePath("/vocabulary");
    return { success: true };
  } catch (error) {
    console.error("Error updating vocab status:", error);
    return { success: false, error: "Failed to update vocabulary progress" };
  }
}
