import { env } from "@/env";
import { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// globally init ecc lib for server
import * as bitcoin from "bitcoinjs-lib";
import ecc from "@bitcoinerlab/secp256k1";
import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";

bitcoin.initEccLib(ecc);

const matter = localFont({
  src: [
    {
      path: "../assets/fonts/Matter-Regular.woff2",
      style: "normal",
      weight: "400",
    },
  ],
  display: "swap",
  variable: "--font-matter",
});

const matterMono = localFont({
  src: [
    {
      path: "../assets/fonts/MatterMono-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../assets/fonts/MatterMono-Medium.woff2",
      style: "normal",
      weight: "600",
    },
  ],
  display: "swap",
  variable: "--font-matter-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${matter.className} ${matter.variable} ${matterMono.variable}`}
      >
        {env.BANNER_CONTENT && (
          <div
            className="w-full bg-[#F26969] text-white text-center py-2"
            dangerouslySetInnerHTML={{ __html: env.BANNER_CONTENT }}
          />
        )}
        {children}
        {env.SUPPORT_LINK && (
          <a
            href={env.SUPPORT_LINK}
            target="_blank"
            title="Support"
            className={
              "fixed z-90 bottom-20 right-8 bg-orange w-20 " +
              "h-20 rounded-full drop-shadow-lg flex justify-center " +
              "items-center text-white text-4xl"
            }
          >
            <ChatBubbleLeftIcon className="w-8 h-8 text-black" />
          </a>
        )}
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(env.BRIDGE_APP_URL),
  title: "sBTC Bridge",
  description: "sBTC Bridge",
};

export const dynamic = "force-dynamic";
