import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { VocabStatus } from "@prisma/client";
import VocabularyContent from "@/components/vocabulary/vocabulary-content";

export default async function VocabularyPage() {
  const session = await auth();
  
  // Fetch words with their Indonesian definitions and examples
  const words = await prisma.vocabulary.findMany({
    orderBy: {
      word: "asc",
    },
  });

  // Fetch user progress if logged in
  let userProgress: { vocabId: string; status: VocabStatus }[] = [];
  if (session?.user?.id) {
    const progress = await prisma.vocabProgress.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        vocabId: true,
        status: true,
      },
    });
    userProgress = progress as { vocabId: string; status: VocabStatus }[];
  }

  return (
    <VocabularyContent 
      words={words} 
      userProgress={userProgress} 
    />
  );
}
