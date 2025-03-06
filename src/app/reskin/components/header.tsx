"use client";

import SbtcBridgeLogo from "./sbtc-bridge-logo";

import Link from "next/link";
import { ConnectButton } from "./header/connect-button";
import { ThemeToggler } from "./header/theme-toggler";
export default function Header() {
  return (
    <header className="w-full mx-auto py-6 flex justify-between">
      <Link href="/reskin" className="flex items-center">
        <SbtcBridgeLogo />
        <h1 className="ml-1 text-xl tracking-tight">Bridge</h1>
      </Link>
      <div className="flex gap-4">
        <ThemeToggler />
        <ConnectButton />
      </div>
    </header>
  );
}
