import { env } from "@/env";
import { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
