import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Section } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  if (!section || !Object.values(Section).includes(section as any)) {
    return NextResponse.json({ message: "Invalid section" }, { status: 400 });
  }

  try {
    const questions = await prisma.question.findMany({
      where: {
        section: section as Section,
      },
      take: 20,
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Fetch questions error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
