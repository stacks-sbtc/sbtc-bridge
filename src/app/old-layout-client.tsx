"use client";

import { BridgeConfig } from "@/util/atoms";

import Header from "@/comps/Header";

import LayoutClient from "./layout-client";
import { NavTabs } from "./(reskin)/components/tabs/nav-tabs";

const tabs = [
  {
    label: "Deposit",
    link: "/",
  },
  {
    label: "Withdraw",
    link: "/withdraw",
  },
];

export default function OldLayoutClient({
  children,
  config,
  footer,
}: Readonly<{
  children: React.ReactNode;
  footer: React.ReactNode;
  config: BridgeConfig;
}>) {
  return (
    <LayoutClient config={config}>
      <main className="min-w-screen bg-white  flex items-center flex-col min-h-screen w-full">
        <Header config={config} />
        <hr className="bg-black hidden w-full sm:block" />
        <NavTabs tabs={tabs} />
        {children}
        <a
          key="faqs"
          href="https://docs.stacks.co/concepts/sbtc/sbtc-faq"
          target="_blank"
          rel="noreferrer"
          className="text-white font-light block text-xl font-Matter px-20 py-2 bg-[#fd8341] rounded opacity-90"
        >
          FAQs
        </a>
        {footer}
        {/* to fill the place of the nav tabs in mobile */}
        <hr className="block w-full sm:hidden h-20" />
      </main>
    </LayoutClient>
  );
}
