import { env } from "@/env";
import { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// globally init ecc lib for server
import * as bitcoin from "bitcoinjs-lib";
import ecc from "@bitcoinerlab/secp256k1";
bitcoin.initEccLib(ecc);

const matter = localFont({
  src: "../../public/fonts/Matter-Regular.ttf",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={matter.className}>{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(env.BRIDGE_APP_URL),
  title: "sBTC Bridge",
  description: "sBTC Bridge",
};

export const dynamic = "force-dynamic";
