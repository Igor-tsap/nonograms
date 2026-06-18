import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";


export default async function Home() {
  const t = await getTranslations("Home");
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold tracking-tighter mb-4 text-black">
        {t("title")}
      </h1>
      <p className="text-gray-600 text-lg mb-10 max-w-md">
        {t("description")}
      </p>
      <div className="flex gap-4">
        <Link
          href="/puzzles"
          className="bg-white text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50" 
        >
          {t("browseButton")}
        </Link>
      </div>
    </div>
  );
}