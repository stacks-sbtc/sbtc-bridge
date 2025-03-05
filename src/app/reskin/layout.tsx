"use server";
import getSbtcBridgeConfig from "@/actions/get-sbtc-bridge-config";
import LayoutClient from "../layout-client";
import LayoutClientReskin from "./layout-client-reskin";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sBTCBridgeConfig = await getSbtcBridgeConfig();
  return (
    <LayoutClient config={sBTCBridgeConfig}>
      <LayoutClientReskin>{children}</LayoutClientReskin>
    </LayoutClient>
  );
}
