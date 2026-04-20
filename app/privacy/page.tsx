import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi toeflup terkait pengumpulan dan penggunaan data Anda.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight">Kebijakan Privasi</h1>
      <div className="prose dark:prose-invert">
        <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
        <p>Kami sangat menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan toeflup.</p>
        <h2>Pengumpulan Data</h2>
        <p>Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar akun, seperti nama dan alamat email, serta data analitik saat Anda menggunakan platform latihan kami.</p>
      </div>
    </div>
  );
}
