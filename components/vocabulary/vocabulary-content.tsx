"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Volume2, BookPlus, Star, LayoutGrid, CreditCard } from "lucide-react";
import { WordCard } from "./word-card";
import { VocabStatus } from "@prisma/client";

interface UserProgress {
  vocabId: string;
  status: VocabStatus;
}

interface VocabularyContentProps {
  words: any[]; // Kept as any[] for now as Prisma type is complex, but removed the unused Word interface
  userProgress: UserProgress[];
}

export default function VocabularyContent({ words, userProgress }: VocabularyContentProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"list" | "flashcards">("list");
  const [activeCategory, setActiveCategory] = React.useState("All");

  const progressMap = React.useMemo(() => {
    const map = new Map<string, VocabStatus>();
    userProgress.forEach(p => map.set(p.vocabId, p.status));
    return map;
  }, [userProgress]);

  const filteredVocab = words.filter(item => {
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.definitionId && item.definitionId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Vocabulary Bank
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Master academic words frequently used in the TOEFL.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-muted p-1 rounded-lg flex items-center">
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("list")}
              className="px-3"
            >
              <LayoutGrid className="size-4 mr-2" /> List
            </Button>
            <Button 
              variant={viewMode === "flashcards" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("flashcards")}
              className="px-3"
            >
              <CreditCard className="size-4 mr-2" /> Flashcards
            </Button>
          </div>
          <Button className="shadow-lg shadow-primary/20">
            <Star className="mr-2 size-4" /> My Favorites
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
        <Input 
          placeholder="Search words or meanings..." 
          className="pl-10 h-12 text-lg shadow-sm border-2 focus-visible:border-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", "Academic", "General", "Science", "History", "Business"].map((cat) => (
          <Badge 
            key={cat} 
            variant={cat === activeCategory ? "default" : "secondary"} 
            className="px-4 py-1.5 cursor-pointer hover:bg-primary/80 transition-colors"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVocab.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border focus-within:border-primary/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors underline decoration-primary/20 underline-offset-4">
                      {item.word}
                    </CardTitle>
                    <CardDescription className="italic text-primary/70 font-medium">
                      ({item.partOfSpeech})
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {progressMap.has(item.id) && (
                      <Badge variant={progressMap.get(item.id) === "MASTERED" ? "default" : "secondary"} className="text-[10px]">
                        {progressMap.get(item.id)}
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                      <Volume2 className="size-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium mb-4">{item.definitionId}</p>
                <div className="flex items-center justify-between mt-auto">
                  <Badge variant="outline" className="bg-muted/50">{item.difficulty}</Badge>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookPlus className="size-4 mr-2" /> Add to Study
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === "flashcards" && (
        <div className="flex flex-col items-center gap-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Study Flashcards</h2>
            <p className="text-muted-foreground">Click the card to see the definition and examples.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 w-full place-items-center">
            {filteredVocab.map((item) => (
              <WordCard 
                key={item.id} 
                word={{
                  ...item,
                  exampleId: item.exampleId || "",
                }} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
