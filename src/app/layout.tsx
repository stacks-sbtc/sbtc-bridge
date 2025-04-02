import { env } from "@/env";
import { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// globally init ecc lib for server
import * as bitcoin from "bitcoinjs-lib";
import ecc from "@bitcoinerlab/secp256k1";
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
        {children}
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
