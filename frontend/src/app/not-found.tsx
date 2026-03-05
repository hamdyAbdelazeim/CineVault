import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#0a0a0a] text-white">
      <p className="text-8xl font-black text-red-600">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-neutral-400">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-red-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-500"
      >
        Go Home
      </Link>
    </div>
  );
}
