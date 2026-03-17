import { BookOpen, Brain, Gauge, Layout } from "lucide-react";

const features = [
  {
    title: "Latihan Soal Adaptif",
    description: "Soal yang menyesuaikan dengan tingkat kemampuanmu, membantumu berkembang lebih cepat dan efisien.",
    icon: Gauge,
  },
  {
    title: "Flashcards Cerdas",
    description: "Gunakan sistem Spaced Repetition untuk menghafal 570+ Academic Word List tanpa lupa.",
    icon: Brain,
  },
  {
    title: "Simulasi Tes Realistis",
    description: "Rasakan pengalaman tes TOEFL iBT sebenarnya dengan timer dan format yang identik.",
    icon: Layout,
  },
  {
    title: "Rencana Belajar Personal",
    description: "Dapatkan jadwal belajar harian otomatis berdasarkan target skor dan tanggal tes kamu.",
    icon: BookOpen,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-zinc-50 py-24 dark:bg-black/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-4xl">
            Segalanya yang Kamu Butuhkan untuk Lulus
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Didesain oleh pakar edukasi untuk memberikan pengalaman belajar mandiri yang paling efektif.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-primary/50 hover:shadow-lg dark:border-zinc-800 dark:bg-black"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-primary dark:bg-zinc-800">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-black dark:text-white">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
