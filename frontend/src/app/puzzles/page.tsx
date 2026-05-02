"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPuzzles, getAttempts } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Puzzle {
  id: number;
  title: string;
  author_username: string;
  hor_size: number;
  ver_size: number;
  difficulty: string;
  row_clues: number[][];
  col_clues: number[][];
}

interface Attempt {
  id: number;
  puzzle_id: number;
  status: string;
  current_grid: number[][];
}

const difficultyColor: Record<string, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

export default function PuzzlesPage() {
  const { user } = useAuth();
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (difficulty) params.difficulty = difficulty;
        const data = await getPuzzles(params);
        setPuzzles(data);
        if (user) {
          const att = await getAttempts();
          setAttempts(att);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [difficulty, user]);

  const attemptMap = Object.fromEntries([...attempts].reverse().map((a) => [a.puzzle_id, a]));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Puzzles</h1>
        <div className="flex gap-2">
          {["", "easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                difficulty === d
                  ? "bg-white text-black"
                  : "text-gray-600 hover:text-black border border-gray-300"
              }`}
            >
              {d || "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-20">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {puzzles.map((puzzle) => {
            const attempt = attemptMap[puzzle.id];
            const displayGrid = attempt?.current_grid || Array.from({ length: puzzle.ver_size }, () => Array(puzzle.hor_size).fill(0));
            return (
              <Link
                key={puzzle.id}
                href={`/puzzles/${puzzle.id}`}
                className="group bg-white border border-gray-300 rounded-2xl p-5 hover:border-gray-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-semibold text-black group-hover:text-gray-800">{puzzle.title}</h2>
                  <div 
                    className="grid shrink-0 border border-gray-100 bg-white shadow-sm overflow-hidden"
                    style={{ gridTemplateColumns: `repeat(${puzzle.hor_size}, 4px)` }}
                  >
                    {displayGrid.flat().map((cell, i) => (
                      <div 
                        key={i} 
                        className={`w-[4px] h-[4px] ${cell === 1 ? 'bg-black' : 'bg-transparent'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="text-gray-600 text-sm mb-3">
                  {puzzle.hor_size}×{puzzle.ver_size} · by {puzzle.author_username}
                </div>
                <span className={`text-xs font-medium ${difficultyColor[puzzle.difficulty] || "text-gray-600"}`}>
                  {puzzle.difficulty}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
