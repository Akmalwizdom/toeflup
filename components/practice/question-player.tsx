"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressIndicator } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  content: string;
  options: string[];
  passage?: string | null;
  audioUrl?: string | null;
}

import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: string;
  content: string;
  options: string[];
  passage?: string | null;
  audioUrl?: string | null;
  correctAnswer: number;
  explanation?: string | null;
}

interface QuestionPlayerProps {
  questions: Question[];
  section: string;
  onComplete: (sessionData: any) => Promise<any>;
}

export function QuestionPlayer({ questions, section, onComplete }: QuestionPlayerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [score, setScore] = React.useState(0);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleCheck = () => {
    if (selectedOption !== null) {
      setShowFeedback(true);
      if (selectedOption === currentQuestion.correctAnswer) {
        setScore((prev) => prev + 1);
      }
    }
  };

  const handleNext = async () => {
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption! };
    setAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsSubmitting(true);
      try {
        const submissionData = Object.entries(newAnswers).map(([id, ans]) => {
          const q = questions.find(q => q.id === id)!;
          return {
            questionId: id,
            selectedAnswer: ans,
            isCorrect: ans === q.correctAnswer,
            timeSpent: 0, // Simplified
          };
        });
        
        await onComplete(submissionData);
        router.push(`/practice/results?score=${score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0)}&total=${questions.length}&section=${section}`);
      } catch (error) {
        console.error("Error submitting:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress}>
          <ProgressIndicator style={{ transform: `translateX(-${100 - progress}%)` }} />
        </Progress>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentQuestion.passage && (
          <Card className="h-[500px] overflow-y-auto bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Reading Passage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert">
                {currentQuestion.passage}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className={cn("flex flex-col", !currentQuestion.passage && "md:col-span-2")}>
          <CardHeader>
            <CardTitle className="text-xl">Question</CardTitle>
            <CardDescription className="text-base text-foreground mt-2">
              {currentQuestion.content}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              
              let variant: "outline" | "default" | "destructive" | "secondary" = "outline";
              if (showFeedback) {
                if (isCorrect) variant = "secondary"; // Green-ish
                else if (isSelected) variant = "destructive";
              } else if (isSelected) {
                variant = "default";
              }

              return (
                <Button
                  key={index}
                  variant={variant}
                  disabled={showFeedback}
                  className={cn(
                    "w-full justify-start h-auto py-4 px-6 text-left whitespace-normal transition-all",
                    showFeedback && isCorrect && "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-500/10",
                    showFeedback && isSelected && !isCorrect && "bg-destructive/10 border-destructive text-destructive hover:bg-destructive/10"
                  )}
                  onClick={() => setSelectedOption(index)}
                >
                  <span className="flex-shrink-0 mr-4 font-bold opacity-50">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {showFeedback && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
                  {showFeedback && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-destructive" />}
                </Button>
              );
            })}

            {showFeedback && currentQuestion.explanation && (
              <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm">
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-2">
                  Explanation:
                </p>
                <p className="text-muted-foreground italic">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6 bg-muted/10">
            {!showFeedback ? (
              <Button 
                className="ml-auto min-w-32" 
                disabled={selectedOption === null}
                onClick={handleCheck}
              >
                Check Answer
              </Button>
            ) : (
              <Button 
                className="ml-auto min-w-32" 
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (currentIndex === questions.length - 1 ? "Finish Session" : "Next Question")}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
