import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { QuestionPlayer } from "@/components/practice/question-player";
import { redirect } from "next/navigation";
import Link from "next/link";
import { submitPracticeSession } from "@/lib/actions/practice";
import { Section } from "@prisma/client";

export default async function PracticeSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  // Validate section
  const validSections = Object.values(Section) as string[];
  if (!validSections.includes(section)) {
    redirect("/practice");
  }

  const questions = await prisma.question.findMany({
    where: {
      section: section as Section,
    },
    take: 10,
  });

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-bold">No questions found</h2>
        <p className="text-muted-foreground">We are working on adding more questions to this section.</p>
        <Link href="/practice" className="text-primary hover:underline">Go back</Link>
      </div>
    );
  }

  // Transform Prisma questions to match QuestionPlayer component interface
  const formattedQuestions = questions.map((q: any) => ({
    id: q.id,
    content: q.questionText,
    options: q.options as string[],
    passage: q.passage,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));

  const handleComplete = async (answers: any) => {
    "use server";
    return await submitPracticeSession(answers);
  };

  return (
    <div className="py-6">
      <QuestionPlayer 
        questions={formattedQuestions}
        section={section}
        onComplete={handleComplete} 
      />
    </div>
  );
}
