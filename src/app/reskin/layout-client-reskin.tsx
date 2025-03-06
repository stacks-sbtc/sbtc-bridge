"use client";

import { useAtomValue } from "jotai";
import Header from "./components/header/header";
import { themeAtom } from "@/util/atoms";
import { useState, useEffect } from "react";
import { NavTabs } from "./components/tabs/nav-tabs";
import { Footer } from "./components/footer";

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
      <main className="flex flex-col items-center min-h-screen bg-white text-black dark:bg-reskin-dark-gray dark:text-white">
        <div className="flex flex-col w-full">
          <Header />
          <NavTabs />
          {children}
          <Footer />
        </div>
      </main>
    </div>
  );
}
