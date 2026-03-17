import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { DashboardMockup } from "./dashboard-mockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-32 dark:bg-black lg:pt-48">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -z-10 h-150 w-full -translate-x-1/2 opacity-20 [background:radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-zinc-200 dark:from-zinc-800" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex animate-fade-in items-center gap-2 rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium dark:bg-zinc-800">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span>Platform Persiapan TOEFL #1 di Indonesia</span>
          </div>
          
          <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight text-black dark:text-white md:text-6xl lg:text-7xl">
            Raih Skor TOEFL Impian Tanpa <span className="text-zinc-500">Ribet</span>
          </h1>
          
          <p className="mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 md:text-xl">
            Latihan soal adaptif, sistem flashcards cerdas, dan simulasi real-time yang dirancang khusus untuk membantu kamu lulus tes TOEFL iBT dengan percaya diri.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="h-14 rounded-full px-8 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Mulai Belajar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                Lihat Demo
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>570+ Kosakata Akademik</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Analitik Berbasis Data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Simulasi Test Realistis</span>
            </div>
          </div>
          
          {/* Dashboard Preview Mockup - Browser Frame */}
          <div className="mt-20 w-full max-w-6xl rounded-2xl border border-zinc-200 bg-white p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-10 items-center justify-start gap-2 border-b bg-zinc-50/50 px-4 dark:bg-zinc-900/50">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400/50" />
                <div className="size-2.5 rounded-full bg-amber-400/50" />
                <div className="size-2.5 rounded-full bg-emerald-400/50" />
              </div>
              <div className="mx-auto flex h-6 w-full max-w-100 items-center justify-center rounded-md border bg-white px-3 text-[10px] text-zinc-400 dark:bg-zinc-950">
                toeflup.com/dashboard
              </div>
            </div>
            <div className="relative aspect-16/10 overflow-hidden rounded-b-xl lg:aspect-video text-left">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
