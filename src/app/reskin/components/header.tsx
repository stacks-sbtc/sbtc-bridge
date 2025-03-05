"use client";

import SbtcBridgeLogo from "./sbtc-bridge-logo";
import { themeAtom } from "@/util/atoms";
import { useAtom } from "jotai";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
export default function Header() {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <header className="w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
      <div className="flex items-center">
        <SbtcBridgeLogo />
        <h1 className="ml-1 text-xl tracking-tight">Bridge</h1>
      </div>
      <button
        className="hover:bg-lightGray dark:hover:bg-darkGray p-2 rounded-full"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>
    </header>
  );
}
