"use client";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { getMyPuzzles, deletePuzzle } from "@/lib/api";
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

const difficultyColor: Record<string, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

export default function MyPuzzlesPage() {
  const t = useTranslations("MyPuzzles");
  const router = useRouter();
  const { user, isCreator } = useAuth();
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyPuzzles();
      setPuzzles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (id: number) => {
    router.push(`/my-puzzles/${id}/edit`);
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDelete"))) return;
    await deletePuzzle(id);
    setPuzzles((prev) => prev.filter((p) => p.id !== id));
  };

  if (!user || !isCreator) {
    return (
      <div className="text-center py-20 text-gray-500">
        {t("notCreator")}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <Link
          href="/create-puzzle"
          className="bg-white text-black font-semibold px-5 py-2 rounded-lg hover:bg-zinc-200 transition-colors text-sm"
        >
          + {t("newPuzzle")}
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-20">{t("loading")}...</div>
      ) : puzzles.length === 0 ? (
        <div className="text-gray-500 text-center py-20">{t("noPuzzles")}.</div>
      ) : (
        <div className="space-y-3">
          {puzzles.map((puzzle) => (
            <div
              key={puzzle.id}
              className="bg-white border border-gray-300 rounded-2xl px-5 py-4 flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold text-black mb-1">{puzzle.title}</h2>
                <div className="text-gray-600 text-sm">
                  {puzzle.hor_size}×{puzzle.ver_size} · {t("authorPrefix")} {puzzle.author_username} ·{" "}
                  <span className={difficultyColor[puzzle.difficulty] || "text-gray-600"}>
                    {t(`difficulties.${puzzle.difficulty}`)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/puzzles/${puzzle.id}`}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {t("actions.view")}
                </Link>
                <button
                  onClick={() => handleEdit(puzzle.id)}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {t("actions.edit")}
                </button>
                <button
                  onClick={() => handleDelete(puzzle.id)}
                  className="text-sm text-red-500 hover:text-red-400 transition-colors"
                >
                  {t("actions.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
