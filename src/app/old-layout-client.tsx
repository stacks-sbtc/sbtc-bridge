"use client";

import { BridgeConfig } from "@/util/atoms";

import Header from "@/comps/Header";
import Footer from "@/comps/footer";

import LayoutClient from "./layout-client";

export default function OldLayoutClient({
  children,
  config,
}: Readonly<{
  children: React.ReactNode;
  config: BridgeConfig;
}>) {
  return (
    <LayoutClient config={config}>
      <main className="min-w-screen bg-white  flex items-center flex-col min-h-screen ">
        <Header config={config} />
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
        <Footer config={config} />
      </main>
    </LayoutClient>
  );
}
