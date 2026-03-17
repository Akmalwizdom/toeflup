import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-black">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground md:px-16 md:py-24">
              {/* Background pattern */}
              <div className="absolute inset-0 -z-10 opacity-10 [background:radial-gradient(circle_at_top_right,var(--tw-gradient-from)_0%,transparent_70%)] from-white" />
              
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl">
                Siap Melampaui Target Skor Kamu?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg opacity-90 md:text-xl">
                Bergabunglah dengan ribuan pelajar lainnya yang telah sukses meningkatkan skor TOEFL mereka bersama toeflup.
              </p>
              
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-14 rounded-full px-10 text-lg font-semibold">
                  Daftar Sekarang — Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
