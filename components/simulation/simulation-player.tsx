"use client";

import * as React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Timer, 
  BookOpen, 
  Headphones, 
  Mic2, 
  PenTool,
  CheckCircle2,
  Settings,
  X,
  Clock,
  Layout,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { updateSimulationAnswer, submitSimulation } from "@/lib/actions/simulation";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  type: string;
  text: string;
  questionText?: string;
  options?: string[];
  audioUrl?: string;
  passage?: string;
  section: string;
}

interface Simulation {
  id: string;
  type: string;
  answers: Record<string, { id: string; answer: number | string | null }[]>;
  fullQuestions: Question[];
}

interface SimulationPlayerProps {
  simulation: Simulation;
}

export default function SimulationPlayer({ simulation }: SimulationPlayerProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = React.useState<string>("READING");
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(35 * 60);
  const [isSidebarOpen] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);

  // Initialize answers from simulation data
  const [userAnswers, setUserAnswers] = React.useState<Record<string, number | string | null>>(() => {
    const initial: Record<string, number | string | null> = {};
    const answers = simulation.answers as Record<string, { id: string; answer: number | string | null }[]>;
    Object.keys(answers).forEach(section => {
      answers[section].forEach((q) => {
        initial[q.id] = q.answer;
      });
    });
    return initial;
  });

  // Filter questions for the current section
  const questions = (simulation.fullQuestions as Question[]).filter((q) => q.section === currentSection);
  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = async (optionIdx: number) => {
    if (!currentQuestion) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIdx }));
    try {
      await updateSimulationAnswer(simulation.id, currentSection, currentQuestion.id, optionIdx);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTextChange = async (text: string) => {
    if (!currentQuestion) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: text }));
    try {
      await updateSimulationAnswer(simulation.id, currentSection, currentQuestion.id, text);
    } catch (error) {
       console.error(error);
    }
  };

  const handleNextSection = async () => {
    const sections = ["READING", "LISTENING", "SPEAKING", "WRITING"];
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
      setCurrentQuestionIndex(0);
      // Update timer for next section
      if (sections[currentIndex + 1] === "LISTENING") setTimeLeft(36 * 60);
      if (sections[currentIndex + 1] === "SPEAKING") setTimeLeft(20 * 60);
      if (sections[currentIndex + 1] === "WRITING") setTimeLeft(50 * 60);
    } else {
      setIsSubmitting(true);
      try {
        const result = await submitSimulation(simulation.id);
        if (result.success) {
          router.push(`/simulation/${simulation.id}/results`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case "READING": return BookOpen;
      case "LISTENING": return Headphones;
      case "SPEAKING": return Mic2;
      case "WRITING": return PenTool;
      default: return Layout;
    }
  };

  const IconComponent = getSectionIcon(currentSection);

  // Timer logic
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="h-16 border-b bg-white dark:bg-slate-900 px-6 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground size-8 rounded-lg flex items-center justify-center font-black italic shadow-lg shadow-primary/20">T</span>
            <span className="font-bold tracking-tight hidden sm:inline-block uppercase italic">ToeflUp</span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary`}>
              <IconComponent className="size-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black tracking-tight text-slate-800 dark:text-slate-200 text-sm leading-none">{currentSection}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Section State</span>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex bg-slate-50 font-bold text-[10px] tracking-widest border-2 py-0.5">SECTION {sectionsProgress(currentSection)} OF 4</Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-700">
            <Timer className={cn("size-5", timeLeft < 300 ? "text-rose-500 animate-pulse" : "text-primary")} />
            <span className={cn("font-black tabular-nums transition-colors", timeLeft < 300 ? "text-rose-500" : "text-slate-700 dark:text-slate-200")}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Settings className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => router.push("/simulation")}>
            <X className="size-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Question Navigator */}
        <aside className={cn(
          "w-72 border-r bg-white dark:bg-slate-900 flex flex-col transition-all duration-300 transform z-40",
          !isSidebarOpen && "-translate-x-full absolute h-full"
        )}>
          <div className="p-6 border-b text-left">
            <h3 className="font-black text-sm tracking-widest text-slate-400 uppercase">Question Overview</h3>
          </div>
          <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-4 gap-3">
              {questions.map((_: Question, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={cn(
                    "size-10 rounded-xl font-bold flex items-center justify-center transition-all border-2",
                    currentQuestionIndex === idx 
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-primary/50 text-slate-500"
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 border-t bg-slate-50/50 dark:bg-slate-900/50 text-left">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Total Progress</span>
                <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2 rounded-full" />
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-950">
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Passage Side (Optional) */}
            {currentQuestion?.passage && (
              <div className="flex-1 overflow-y-auto p-8 border-r bg-slate-50/30 prose dark:prose-invert max-w-none scrollbar-thin text-left">
                <div className="max-w-2xl mx-auto">
                   <Badge className="mb-6 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase bg-primary/5 text-primary border-primary/10">Reading Passage</Badge>
                   <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-lg">
                     {currentQuestion.passage}
                   </div>
                </div>
              </div>
            )}

            {/* Question Side */}
            <div className={cn(
              "overflow-y-auto p-8 flex flex-col",
              (currentQuestion?.passage || currentSection === "WRITING") ? "w-full md:w-112.5 lg:w-125 xl:w-150 gap-4 shrink-0" : "flex-1"
            )}>
              <div className={cn("w-full mx-auto space-y-8", !(currentQuestion?.passage || currentSection === "WRITING") && "max-w-3xl py-12")}>
                
                {/* Listening Player */}
                {currentSection === "LISTENING" && currentQuestion?.audioUrl && (
                  <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                        <Headphones className="size-32" />
                     </div>
                     <div className="size-full bg-linear-to-br from-primary/20 to-transparent p-8 md:p-12 flex flex-col justify-end gap-4">
                        <Badge className="bg-white/10 text-white border-0 font-black tracking-widest text-[10px] uppercase px-4 py-1.5">Audio Lecture</Badge>
                        <div className="flex items-center gap-4">
                           <Button size="icon" className="size-16 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30" onClick={() => setIsAudioPlaying(!isAudioPlaying)}>
                              {isAudioPlaying ? <Pause className="size-8" /> : <Play className="size-8" />}
                           </Button>
                           <Button variant="ghost" size="icon" className="size-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                              <RotateCcw className="size-5" />
                           </Button>
                        </div>
                        <div className="w-full space-y-2 px-4">
                           <Progress value={isAudioPlaying ? 45 : 0} className="h-2 bg-white/10" />
                           <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <span>01:24</span>
                              <span>03:45</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* Question Info */}
                <div className="flex items-center justify-between">
                   <Badge variant="secondary" className="px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0">
                    QUESTION {currentQuestionIndex + 1} OF {questions.length}
                   </Badge>
                   <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <Clock className="size-3" /> Average 1:45
                  </div>
                </div>

                <div className="space-y-8 text-left">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight tracking-tight">
                    {currentQuestion ? (currentQuestion.questionText || currentQuestion.text) : "Loading question..."}
                  </h2>

                  {/* Options Render (Reading/Listening) */}
                  {(currentSection === "READING" || currentSection === "LISTENING") && (
                    <div className="space-y-3">
                      {(currentQuestion?.options as string[] || []).map((option, idx) => {
                        const isSelected = userAnswers[currentQuestion.id] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={cn(
                              "w-full p-5 rounded-2xl border-2 flex items-center gap-5 transition-all duration-300 text-left group relative overflow-hidden",
                              isSelected 
                                ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" 
                                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary/30"
                            )}
                          >
                            <div className={cn(
                              "size-10 rounded-xl border-2 font-black flex items-center justify-center transition-all duration-300 shrink-0",
                              isSelected 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                            )}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className={cn(
                              "text-base font-bold transition-colors",
                              isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                            )}>
                              {option}
                            </span>
                            {isSelected && (
                              <div className="absolute top-0 right-0 p-2">
                                <CheckCircle2 className="size-4 text-primary" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Speaking Mic UI */}
                  {currentSection === "SPEAKING" && (
                     <div className="flex flex-col items-center gap-8 py-12">
                        <div className="relative">
                           <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                           <Button size="icon" className="size-32 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 relative z-10 transition-transform active:scale-95">
                              <Mic2 className="size-12" />
                           </Button>
                        </div>
                        <div className="text-center space-y-2">
                           <span className="text-sm font-black text-primary uppercase tracking-widest animate-pulse">Recording...</span>
                           <h4 className="text-4xl font-black tabular-nums text-slate-800 dark:text-white">00:45</h4>
                           <p className="text-xs font-bold text-slate-400 tracking-wider">PREPARATION TIME ENDS IN 00:15</p>
                        </div>
                     </div>
                  )}

                  {/* Writing Editor UI */}
                  {currentSection === "WRITING" && (
                    <div className="space-y-4">
                       <textarea
                        className="w-full h-87.5 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-lg leading-relaxed font-serif text-slate-700 dark:text-slate-300"
                        placeholder="Start typing your response here..."
                        value={(userAnswers[currentQuestion?.id] as string) || ""}
                        onChange={(e) => handleTextChange(e.target.value)}
                       />
                       <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                          <span>Auto-saving enabled</span>
                          <span>{((userAnswers[currentQuestion?.id] as string) || "").split(/\s+/).filter(Boolean).length} Words</span>
                       </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <footer className="h-24 border-t bg-white dark:bg-slate-900 px-8 flex items-center justify-between z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
            <Button 
              variant="outline" 
              className="gap-2 border-2 px-6 h-12 rounded-xl font-bold hover:bg-slate-50"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            >
              <ChevronLeft className="size-5" /> Previous
            </Button>
            
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex -space-x-2">
                {questions.map((q: Question, idx: number) => (
                  <div 
                    key={idx}
                    className={cn(
                      "size-2 rounded-full border border-white",
                      userAnswers[q.id] ? "bg-primary" : "bg-slate-200"
                    )}
                  />
                ))}
              </div>
              <div className="text-[10px] font-black tracking-widest uppercase text-slate-400">You&apos;re unstoppable</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {Object.keys(userAnswers).filter(id => questions.some((q: Question) => q.id === id)).length} / {questions.length} Answered
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="gap-2 border-2 px-6 h-12 rounded-xl font-bold hidden sm:flex border-primary/20 text-primary hover:bg-primary/5"
              >
                Review Later
              </Button>
              <Button 
                className="gap-2 px-8 h-12 rounded-xl font-bold shadow-xl shadow-primary/20 min-w-40"
                disabled={isSubmitting}
                onClick={() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                  } else {
                    handleNextSection();
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : (currentQuestionIndex === questions.length - 1 ? "Next Section" : "Save & Continue")} 
                {!isSubmitting && <ChevronRight className="size-5" />}
              </Button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function sectionsProgress(section: string) {
  switch (section) {
    case "READING": return "1";
    case "LISTENING": return "2";
    case "SPEAKING": return "3";
    case "WRITING": return "4";
    default: return "1";
  }
}
