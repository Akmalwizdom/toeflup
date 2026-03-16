"use client";

import { useSearchParams } from "next/navigation";
import { PracticeResult } from "@/components/practice/practice-result";
import { Suspense } from "react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  const section = searchParams.get("section") || "Practice";

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <PracticeResult 
        score={score} 
        total={total} 
        section={section} 
      />
    </div>
  );
}

export default function PracticeResultsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-32">Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
