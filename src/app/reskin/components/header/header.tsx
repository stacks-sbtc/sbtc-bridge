"use client";

// import SbtcBridgeLogo from "../sbtc-bridge-logo";
import stacksLogo from "../../../../../public/images/StacksNav.svg";
import Link from "next/link";
import { ConnectButton } from "./connect-button";
import { ThemeToggler } from "./theme-toggler";
import Image from "next/image";
export default function Header() {
  return (
    <header className="w-full mx-auto gap-4 items-center flex justify-center min-h-20 border-b-4 border-light-reskin-border-gray px-4 sm:px-6 lg:px-8 dark:border-dark-reskin-border-gray sm:border-b">
      <div className="flex w-full justify-between max-w-7xl">
        <Link href="/reskin" className="flex items-center w-1/3">
          {/* <SbtcBridgeLogo /> */}
          {/* <h1 className="ml-1 text-xl tracking-tight">Bridge</h1> */}
          <Image src={stacksLogo} alt="Stacks Logo" className="dark:invert" />
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeToggler />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
