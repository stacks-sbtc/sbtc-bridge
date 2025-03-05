import getSbtcBridgeConfig from "@/actions/get-sbtc-bridge-config";
import LayoutClient from "../layout-client";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sBTCBridgeConfig = await getSbtcBridgeConfig();
  return <LayoutClient config={sBTCBridgeConfig}>{children}</LayoutClient>;
}
