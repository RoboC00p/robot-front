import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        404
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-zinc-900 underline underline-offset-4 hover:no-underline dark:text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
