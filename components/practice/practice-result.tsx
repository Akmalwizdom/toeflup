"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";

interface ResultProps {
  score: number;
  total: number;
  section: string;
}

export function PracticeResult({ score, total, section }: ResultProps) {
  const percentage = Math.round((score / total) * 100);

  return (
    <Card className="max-w-md mx-auto text-center shadow-2xl border-2">
      <CardHeader>
        <div className="mx-auto size-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="size-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Session Complete!</CardTitle>
        <p className="text-muted-foreground">You have finished the {section} section practice.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-5xl font-black text-primary">
            {score} / {total}
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Your Score</p>
        </div>

        <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-1000 ease-out" 
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground italic">
          {percentage >= 80 ? "Excellent work! You're mastering this section." : 
           percentage >= 50 ? "Good job! Keep practicing to improve further." : 
           "Don't give up! Review the concepts and try again."}
        </p>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/practice">
            <RotateCcw className="mr-2 size-4" /> Retry
          </Link>
        </Button>
        <Button className="flex-1 shadow-lg shadow-primary/25" asChild>
          <Link href="/dashboard">
            Dashboard <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
