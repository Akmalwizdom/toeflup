"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Volume2, RotateCw, CheckCircle2, Loader2 } from "lucide-react";
import { updateVocabStatus } from "@/lib/actions/vocabulary";
import { VocabStatus } from "@prisma/client";

interface Word {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleEn: string;
  exampleId: string;
  difficulty: string;
}

interface WordCardProps {
  word: Word;
  onStatusUpdate?: (status: VocabStatus) => void;
}

export function WordCard({ word, onStatusUpdate }: WordCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const toggleFlip = () => setIsFlipped(!isFlipped);

  const handleStatusUpdate = async (status: VocabStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUpdating(true);
    try {
      const result = await updateVocabStatus(word.id, status);
      if (result.success) {
        // toast.success(`Word marked as ${status.toLowerCase()}`);
        onStatusUpdate?.(status);
      } else {
        // toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In real app, call text-to-speech or audio file
    console.log("Playing audio for:", word.word);
  };

  return (
    <div 
      className="group perspective-1000 w-full max-w-md h-100 cursor-pointer"
      onClick={toggleFlip}
    >
      <div className={cn(
        "relative w-full h-full transition-all duration-500 preserve-3d",
        isFlipped && "rotate-y-180"
      )}>
        {/* Front Side */}
        <Card className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-8 bg-linear-to-br from-background to-muted/50 border-2 shadow-xl group-hover:border-primary/50 transition-colors">
          <Badge className="mb-4">{word.difficulty}</Badge>
          <h2 className="text-5xl font-bold tracking-tight mb-2">{word.word}</h2>
          <p className="text-muted-foreground italic mb-6">({word.partOfSpeech})</p>
          <Button variant="ghost" size="icon" onClick={playAudio} className="hover:bg-primary/10">
            <Volume2 className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-6 flex items-center gap-2 text-xs text-muted-foreground">
            <RotateCw className="h-3 w-3" /> Click to flip
          </div>
        </Card>

        {/* Back Side */}
        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col p-8 bg-linear-to-br from-background to-primary/5 border-2 border-primary/20 shadow-xl">
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Definition</h3>
              <p className="text-xl leading-relaxed">{word.definition}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Example</h3>
              <p className="text-muted-foreground italic">&quot;{word.exampleEn}&quot;</p>
              <p className="text-sm text-muted-foreground mt-2 opacity-70">{word.exampleId}</p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-6 border-t">
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              disabled={isUpdating}
              onClick={(e) => handleStatusUpdate("LEARNING", e)}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Need Practice"}
            </Button>
            <Button 
              className="flex-1 gap-2"
              disabled={isUpdating}
              onClick={(e) => handleStatusUpdate("MASTERED", e)}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> I Know This
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
