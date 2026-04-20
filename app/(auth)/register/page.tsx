import { AuthForm } from "@/components/auth/auth-form";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Daftar" };

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-muted/30 p-4">
      <h1 className="sr-only">Daftar ke toeflup</h1>
      <Link href="/" className="absolute top-4 left-4 text-sm text-muted-foreground hover:text-foreground">
        &larr; Kembali ke Beranda
      </Link>
      <AuthForm mode="register" />
    </div>
  );
}
