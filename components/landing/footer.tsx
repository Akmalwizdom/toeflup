import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white py-12 dark:bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="text-xl font-bold tracking-tight text-black dark:text-white">
              toefl<span className="text-primary">up</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              © 2026 toeflup. Dibuat dengan ❤️ oleh tim Product.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="#" className="hover:text-black dark:hover:text-white">Tentang Kami</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white">Fitur</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white">Harga</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white">Privasi</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
