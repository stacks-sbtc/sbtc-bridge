import getSbtcBridgeConfig from "@/actions/get-sbtc-bridge-config";
import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import OldLayoutClient from "./old-layout-client";
import Footer from "@/comps/footer";

export default async function OldLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sBTCBridgeConfig = await getSbtcBridgeConfig();
  return (
    <>
      <OldLayoutClient
        footer={<Footer config={sBTCBridgeConfig} />}
        config={sBTCBridgeConfig}
      >
        {children}
      </OldLayoutClient>
      {sBTCBridgeConfig.SUPPORT_LINK && (
        <a
          href={sBTCBridgeConfig.SUPPORT_LINK}
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
    </>
  );
}
