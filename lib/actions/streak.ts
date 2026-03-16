"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay, subDays, isSameDay } from "date-fns";

export async function getStreakStats() {
  const session = await auth();
  if (!session?.user?.id) return { currentStreak: 0, lastStudied: null, history: [] };

  const userId = session.user.id;

  const streaks = await prisma.streak.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  if (streaks.length === 0) {
    return { currentStreak: 0, lastStudied: null, history: [] };
  }

  // Calculate current streak
  let currentStreak = 0;
  const today = startOfDay(new Date());
  let checkDate = today;

  // If they didn't study today, check if they studied yesterday to maintain the streak
  let lastStudied = startOfDay(new Date(streaks[0].date));
  
  if (!isSameDay(lastStudied, today) && !isSameDay(lastStudied, subDays(today, 1))) {
    currentStreak = 0;
  } else {
    // If they studied today or yesterday, count backwards
    for (let i = 0; i < streaks.length; i++) {
        const streakDate = startOfDay(new Date(streaks[i].date));
        
        // Skip today if checking for historical matches
        if (i === 0 && isSameDay(streakDate, today)) {
          currentStreak++;
          checkDate = subDays(today, 1);
          continue;
        }

        if (isSameDay(streakDate, checkDate)) {
            currentStreak++;
            checkDate = subDays(checkDate, 1);
        } else if (streakDate < checkDate) {
            // Gap found
            break;
        }
    }
  }

  return {
    currentStreak,
    lastStudied: streaks[0].date,
    history: streaks.slice(0, 30), // Last 30 days of activity
  };
}

export async function updateStreak(minutes: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = session.user.id;
  const today = startOfDay(new Date());

  // Check if there's already a streak record for today
  const existingStreak = await prisma.streak.findFirst({
    where: {
      userId,
      date: {
        gte: today,
        lte: endOfDay(today),
      }
    }
  });

  if (existingStreak) {
    await prisma.streak.update({
      where: { id: existingStreak.id },
      data: {
        minutesStudied: existingStreak.minutesStudied + minutes
      }
    });
  } else {
    await prisma.streak.create({
      data: {
        userId,
        date: today,
        minutesStudied: minutes
      }
    });
  }
}
