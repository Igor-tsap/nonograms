import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold tracking-tighter mb-4 text-black">
        nonogram
      </h1>
      <p className="text-gray-600 text-lg mb-10 max-w-md">
        Japanese crossword puzzles. Solve, create, share.
      </p>
      <div className="flex gap-4">
        <Link
          href="/puzzles"
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
        >
          Browse Puzzles
        </Link>
      </div>
    </div>
  );
}
