"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Layout } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: "READING",
    title: "Reading",
    description: "Practice your reading comprehension with academic passages.",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-500",
    href: "/practice/READING",
  },
  {
    id: "LISTENING",
    title: "Listening",
    description: "Improve your listening skills with campus conversations and lectures.",
    icon: Headphones,
    color: "bg-purple-500/10 text-purple-500",
    href: "/practice/LISTENING",
  },
  {
    id: "GRAMMAR",
    title: "Structure & Grammar",
    description: "Master grammar rules and sentence structures.",
    icon: Layout,
    color: "bg-orange-500/10 text-orange-500",
    href: "/practice/GRAMMAR",
  },
];

export default function PracticePage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Practice Mode
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Select a section to start your targeted practice session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
            <CardHeader className="pb-2">
              <div className={`size-12 rounded-xl ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <section.icon className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
              <CardDescription className="min-h-12 mt-2">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full shadow-lg group-hover:shadow-primary/25 transition-all">
                <Link href={section.href}>Start Practice</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
