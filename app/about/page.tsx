import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Pelajari lebih lanjut tentang toeflup dan misi kami.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight">Tentang toeflup</h1>
      <div className="prose dark:prose-invert">
        <p>toeflup adalah platform persiapan TOEFL iBT terdepan di Indonesia. Misi kami adalah membantu pelajar dan profesional meraih skor TOEFL impian mereka dengan pendekatan belajar yang efisien dan berbasis data.</p>
      </div>
    </div>
  );
}
