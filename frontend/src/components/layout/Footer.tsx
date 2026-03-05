import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-neutral-950 py-12 text-neutral-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter text-red-500">
            CINE<span className="text-white">VAULT</span>
          </Link>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/watchlist" className="hover:text-white transition-colors">Watchlist</Link>
          </div>

          <p className="text-xs text-center">
            Data by{' '}
            <span className="font-medium text-neutral-300">TMDB</span>
            {' · '}© {new Date().getFullYear()} CineVault
          </p>
        </div>
      </div>
    </footer>
  );
}
