"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { ChangeEvent } from "react";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLocaleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    
    // next-intl's router automatically swaps the prefix while preserving parameters
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentLocale}
        onChange={handleLocaleChange}
        className="bg-zinc-50 border border-gray-200 text-gray-700 text-xs rounded-lg pl-2 pr-6 py-1.5 font-semibold outline-none hover:border-gray-400 transition-colors cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 6px center",
          backgroundSize: "12px",
        }}
      >
        <option value="en">EN</option>
        <option value="uk">UA</option>
      </select>
    </div>
  );
}