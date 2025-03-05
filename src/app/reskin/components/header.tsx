"use client";

import { themeAtom } from "@/util/atoms";
import { useAtom } from "jotai";

export default function Header() {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">SBTC Bridge</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </header>
  );
}
