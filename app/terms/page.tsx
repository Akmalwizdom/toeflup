import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan",
  description: "Syarat dan ketentuan penggunaan layanan toeflup.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight">Syarat dan Ketentuan</h1>
      <div className="prose dark:prose-invert">
        <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
        <p>Dengan mengakses dan menggunakan toeflup, Anda menyetujui syarat dan ketentuan berikut:</p>
        <h2>Penggunaan Layanan</h2>
        <p>Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan dengan cara yang tidak melanggar hak orang lain.</p>
      </div>
    </div>
  );
}
