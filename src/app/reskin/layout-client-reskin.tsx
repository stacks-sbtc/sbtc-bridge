"use client";

import { useAtomValue } from "jotai";
import Header from "./components/header";
import { themeAtom } from "@/util/atoms";
import { useState, useEffect } from "react";

export default function LayoutClientReskin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  const theme = useAtomValue(themeAtom);
  if (!loaded) return null;

  return (
    <div className={theme}>
      <main className="flex flex-col min-h-screen bg-white text-black dark:bg-reskin-dark-gray dark:text-white">
        <Header />
        {children}
      </main>
    </div>
  );
}
