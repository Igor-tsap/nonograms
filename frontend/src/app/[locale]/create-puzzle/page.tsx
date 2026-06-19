"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPuzzle } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export default function CreatePuzzlePage() {
  const t = useTranslations("CreatePuzzle");
  const { user, isCreator } = useAuth();
  const router = useRouter();

  const [titleEn, setTitleEn] = useState("");
  const [titleUk, setTitleUk] = useState("");

  const [horSize, setHorSize] = useState(5);
  const [verSize, setVerSize] = useState(5);
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: 5 }, () => Array(5).fill(0)));
  const [painting, setPainting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resizeGrid = (h: number, v: number) => {
    setHorSize(h);
    setVerSize(v);
    setGrid(Array.from({ length: v }, (_, ri) =>
      Array.from({ length: h }, (_, ci) => grid[ri]?.[ci] ?? 0)
    ));
  };

  const handleMouseDown = (r: number, c: number) => {
    const newVal = grid[r][c] === 1 ? 0 : 1;
    setPainting(newVal);
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? newVal : cell))
    );
    setGrid(newGrid);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (painting === null) return;
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? painting : cell))
    );
    setGrid(newGrid);
  };

  const submit = async () => {
    if (!titleEn.trim() || !titleUk.trim()) return setError(t("titleRequired") || "Both English and Ukrainian titles are required.");
    setError("");
    setLoading(true);
    try {
      await createPuzzle({ title: { en: titleEn, uk: titleUk }, hor_size: horSize, ver_size: verSize, solution_grid: grid });
      router.push("/my-puzzles");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("failedToCreatePuzzle"));
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isCreator) {
    return (
      <div className="text-center py-20 text-gray-500">
        {t("notCreator")}
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{t("createPuzzle")}</h1>

      <div className="space-y-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (English)
            </label>
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g., Black Cat"
              className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-black outline-none focus:border-black w-80 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Назва (Українська)
            </label>
            <input
              value={titleUk}
              onChange={(e) => setTitleUk(e.target.value)}
              placeholder="напр., Чорний кіт"
              className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-black outline-none focus:border-black w-80 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">{t("columns")}: {horSize}</label>
            <input
              type="range" min={2} max={30} value={horSize}
              onChange={(e) => resizeGrid(Number(e.target.value), verSize)}
              className="w-40"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">{t("rows")}: {verSize}</label>
            <input
              type="range" min={2} max={30} value={verSize}
              onChange={(e) => resizeGrid(horSize, Number(e.target.value))}
              className="w-40"
            />
          </div>
        </div>
      </div>

      <div
        className="inline-block select-none mb-8"
        onMouseLeave={() => setPainting(null)}
        onMouseUp={() => setPainting(null)}
      >
        {grid.map((row, ri) => (
          <div key={ri} className="flex">
            {row.map((cell, ci) => (
              <div
                key={ci}
                onMouseDown={() => handleMouseDown(ri, ci)}
                onMouseEnter={() => handleMouseEnter(ri, ci)}
                className={`w-4 h-4 border cursor-pointer transition-colors ${
                  cell === 1 ? "bg-black border-gray-500" : "bg-white border-gray-300 hover:bg-gray-50"
                } ${ci % 5 === 0 ? "border-l-zinc-500" : ""} ${ri % 5 === 0 ? "border-t-zinc-500" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={submit}
          disabled={loading}
          className="bg-white text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {loading ? t("creating") : t("createPuzzle")}
        </button>
        <button
          onClick={() => setGrid(Array.from({ length: verSize }, () => Array(horSize).fill(0)))}
          className="text-gray-600 hover:text-black text-sm transition-colors"
        >
          {t("clear")}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
    </div>
  );
}
