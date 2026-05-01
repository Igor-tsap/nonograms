"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getPuzzle, getAttempts, createAttempt, updateAttempt } from "@/lib/api";
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

export default function PuzzlePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [grid, setGrid] = useState<number[][]>([]);
  const [solved, setSolved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const p = await getPuzzle(Number(id));
      setPuzzle(p);
      if (user) {
        const attempts = await getAttempts();
        const existing = attempts.find((a: Attempt) => a.puzzle_id === Number(id));
        if (existing) {
          setAttempt(existing);
          setGrid(existing.current_grid);
          setSolved(existing.status === "completed");
        } else {
          const newAttempt = await createAttempt(Number(id));
          setAttempt(newAttempt);
          setGrid(newAttempt.current_grid);
        }
      }
      setLoading(false);
    };
    load();
  }, [id, user]);

  const toggleCell = useCallback(
    async (r: number, c: number) => {
      if (!attempt || solved) return;
      const newGrid = grid.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? (cell === 1 ? 0 : 1) : cell))
      );
      setGrid(newGrid);
      const updated = await updateAttempt(attempt.id, newGrid);
      if (updated.status === "completed") setSolved(true);
    },
    [grid, attempt, solved]
  );

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!puzzle) return <div className="text-center py-20 text-gray-500">Puzzle not found</div>;

  const maxRowClue = Math.max(...puzzle.row_clues.map((r) => r.length));
  const maxColClue = Math.max(...puzzle.col_clues.map((c) => c.length));

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">{puzzle.title}</h1>
        <p className="text-gray-600 text-sm">
          {puzzle.hor_size}×{puzzle.ver_size} · {puzzle.difficulty} · by {puzzle.author_username}
        </p>
      </div>

      {solved && (
        <div className="mb-6 bg-green-900/30 border border-green-800 rounded-xl px-5 py-4 text-green-400 font-semibold">
          ✓ Puzzle solved!
        </div>
      )}

      {!user && (
        <div className="mb-6 bg-gray-100 border border-gray-300 rounded-xl px-5 py-4 text-gray-700 text-sm">
          Sign in to save your progress
        </div>
      )}

      <div className="overflow-auto">
        <table className="border-collapse" style={{ fontFamily: "var(--font-mono)" }}>
          <thead>
            {Array.from({ length: maxColClue }).map((_, ci) => (
              <tr key={ci}>
                <td colSpan={maxRowClue} />
                {puzzle.col_clues.map((clue, col) => (
                  <td key={col} className="text-center text-xs text-gray-600 px-1 w-8">
                    {clue[ci - (maxColClue - clue.length)] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {grid.map((row, ri) => (
              <tr key={ri}>
                {puzzle.row_clues[ri]
                  .map((n, i) => (
                    <td
                      key={i}
                      className={`text-right text-xs text-gray-600 pr-1 ${
                        i === 0 ? `pl-${(maxRowClue - puzzle.row_clues[ri].length) * 4}` : ""
                      }`}
                    >
                      {n}
                    </td>
                  ))
                  .concat(
                    Array.from({ length: maxRowClue - puzzle.row_clues[ri].length }).map((_, i) => (
                      <td key={`empty-${i}`} />
                    ))
                  )}
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    onClick={() => toggleCell(ri, ci)}
                    className={`
                      w-8 h-8
                      border border-gray-300
                      cursor-pointer transition-colors select-none
                      ${cell === 1 ? "bg-black" : "bg-white hover:bg-gray-50"}
                      ${ci % 5 === 0 ? "border-l-2 !border-l-black" : ""}
                      ${ri % 5 === 0 ? "border-t-2 !border-t-black" : ""}
          `}
    
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
