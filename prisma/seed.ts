import { PrismaClient, Section, Difficulty } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data (optional but recommended for seeds)
  await prisma.practiceAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.vocabProgress.deleteMany();
  await prisma.vocabulary.deleteMany();

  // Reading Question
  await prisma.question.create({
    data: {
      section: Section.READING,
      type: "main_idea",
      difficulty: Difficulty.MEDIUM,
      passage: "Air pressure, also known as barometric pressure, is the force exerted onto a surface by the weight of the air above that surface in the atmosphere of Earth. Meteorologists use pressure changes to forecast upcoming weather events. High pressure systems generally bring clear skies, while low pressure systems often lead to clouds and precipitation.",
      questionText: "What is the main topic of the passage?",
      options: ["The history of Rome", "The rise of industry", "Atmospheric pressure", "Marine biology"],
      correctAnswer: 2, // Index of "Atmospheric pressure"
      explanation: "The passage focuses on how air pressure affects weather patterns.",
    },
  });

  // Structure Question
  await prisma.question.create({
    data: {
      section: Section.GRAMMAR,
      type: "sentence_completion",
      difficulty: Difficulty.EASY,
      questionText: "The first mechanical clocks were ________ large and heavy that they were usually kept in towers.",
      options: ["so", "such", "very", "too"],
      correctAnswer: 0, // Index of "so"
      explanation: "'So' is used with adjectives (large) followed by 'that' for result clauses.",
    },
  });

  // Listening Question
  await prisma.question.create({
    data: {
      section: Section.LISTENING,
      type: "inference",
      difficulty: Difficulty.HARD,
      questionText: "What does the woman imply about the professor?",
      options: ["He is very strict", "He is willing to help", "He forgot the deadline", "He is retiring"],
      correctAnswer: 1, // Index of "He is willing to help"
      explanation: "The woman's statement suggests that the professor is open to student questions.",
    },
  });

  // Speaking Question
  await prisma.question.create({
    data: {
      section: Section.SPEAKING,
      type: "independent_speaking",
      difficulty: Difficulty.MEDIUM,
      questionText: "Do you agree or disagree with the following statement? It is better to study alone than in a group. Use specific reasons and examples to support your opinion.",
      options: [],
      correctAnswer: -1,
      explanation: "State your opinion clearly and provide two supporting reasons with details.",
    },
  });

  // Writing Question
  await prisma.question.create({
    data: {
      section: Section.WRITING,
      type: "independent_writing",
      difficulty: Difficulty.HARD,
      questionText: "Some people prefer to live in a small town. Others prefer to live in a big city. Which place would you prefer to live in? Use specific reasons and details to support your answer.",
      options: [],
      correctAnswer: -1,
      explanation: "A well-structured essay should have an introduction, body paragraphs, and a conclusion.",
    },
  });

  // Another Listening with Audio
  await prisma.question.create({
    data: {
      section: Section.LISTENING,
      type: "detail",
      difficulty: Difficulty.MEDIUM,
      questionText: "Why does the student go to the registrar's office?",
      options: ["To pay a fine", "To pick up a transcript", "To change a course", "To meet a friend"],
      correctAnswer: 1,
      explanation: "The student explicitly mentions needing a copy of their academic record.",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Mock audio
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
