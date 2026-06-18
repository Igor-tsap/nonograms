"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPuzzle, updatePuzzle } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export default function EditPuzzlePage() {
  const { id } = useParams();
  const { user, isCreator } = useAuth();
  const router = useRouter();
  const t = useTranslations("EditPuzzle");
  
  const [title, setTitle] = useState("");
  const [horSize, setHorSize] = useState(5);
  const [verSize, setVerSize] = useState(5);
  const [grid, setGrid] = useState<number[][]>([]);
  const [painting, setPainting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        const data = await getPuzzle(Number(id));
        setTitle(data.title);
        setHorSize(data.hor_size);
        setVerSize(data.ver_size);
        setGrid(data.solution_grid || Array.from({ length: data.ver_size }, () => Array(data.hor_size).fill(0)));
      } catch (e) {
        setError(t("failedToLoadPuzzle"));
      } finally {
        setLoading(false);
      }
    };
    if (id) loadPuzzle();
  }, [id]);

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
    if (!title.trim()) return setError(t("titleRequired"));
    setError("");
    setSaving(true);
    try {
      await updatePuzzle(Number(id), { title, hor_size: horSize, ver_size: verSize, solution_grid: grid });
      router.push("/my-puzzles");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("failedToUpdatePuzzle"));
    } finally {
      setSaving(false);
    }
  };

  if (!user || !isCreator) {
    return <div className="text-center py-20 text-gray-500">{t("notCreator")}.</div>;
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-500">{t("loadingPuzzleData")}...</div>;
  }

  return (
    <div className="absolute top-14 bottom-0 left-0 right-0 overflow-y-auto">
      <div className="w-full px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-8">{t("editPuzzle")}</h1>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm text-gray-700 mb-2">{t("title")}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-black outline-none focus:border-black w-80"
            />
          </div>

          <div className="flex gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">{t("columns")}: {horSize}</label>
              <input
                type="range" min={2} max={20} value={horSize}
                onChange={(e) => resizeGrid(Number(e.target.value), verSize)}
                className="w-40"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">{t("rows")}: {verSize}</label>
              <input
                type="range" min={2} max={20} value={verSize}
                onChange={(e) => resizeGrid(horSize, Number(e.target.value))}
                className="w-40"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto mb-8 py-2">
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
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={submit}
            disabled={saving}
            className="bg-black text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? t("saving") : t("saveChanges")}
          </button>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-black text-sm transition-colors"
          >
            {t("cancel")}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}
