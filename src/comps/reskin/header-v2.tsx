"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import {
  BridgeConfig,
  showConnectWalletAtom,
  walletInfoAtom,
} from "@/util/atoms";

import { useNotifications } from "@/hooks/use-notifications";
import ConnectWallet from "../ConnectWallet";
import { NotificationStatusType } from "../Notifications";
import { GetTestnetBTC } from "../get-testnet-btc";
import SBTCBalance from "../ui/sbtc-balance";
import useMintCaps from "@/hooks/use-mint-caps";

const Header = ({ config }: { config: BridgeConfig }) => {
  const { notify } = useNotifications();
  const { currentCap } = useMintCaps();

  const [walletInfo, setWalletInfo] = useAtom(walletInfoAtom);

  const [showConnectWallet, setShowConnectWallet] = useAtom(
    showConnectWalletAtom,
  );

  const isConnected = useMemo(() => !!walletInfo.selectedWallet, [walletInfo]);

  const isTestnet =
    config.WALLET_NETWORK?.toLowerCase() === "sbtcTestnet".toLowerCase();

  const isMintCapReached = currentCap <= 0;

  const handleSignOut = () => {
    setWalletInfo({
      selectedWallet: null,
      addresses: {
        payment: null,
        taproot: null,
        stacks: null,
        musig: null,
      },
    });
    notify({
      type: NotificationStatusType.SUCCESS,
      message: `Wallet disconnected`,
    });
  };

  const renderUserWalletInfo = () => {
    return (
      <>
        {isTestnet && <GetTestnetBTC />}
        <SBTCBalance address={walletInfo.addresses.stacks!.address} />
        <h3
          onClick={() => handleSignOut()}
          className="font-Matter cursor-pointer text-xs text-white font-semibold tracking-wide"
        >
          DISCONNECT WALLET
        </h3>
      </>
    );
  };

  return (
    <>
      {config.BANNER_CONTENT && (
        <div
          className="w-full bg-[#F26969] text-white text-center py-2"
          dangerouslySetInnerHTML={{ __html: config.BANNER_CONTENT }}
        />
      )}
      <header className="w-full bg-[#272628] py-8 flex items-center justify-center">
        <div
          style={{
            maxWidth: "1200px",
          }}
          className="flex-1 px-4 flex-row flex items-center justify-between"
        >
          <Link href="/">
            <div className="">
              <Image
                src="/images/StacksNavWhite.svg"
                alt="Stacks Logo"
                width={100}
                height={100}
              />
            </div>
          </Link>
          <div className="flex flex-row gap-10 items-center">
            {isConnected ? (
              renderUserWalletInfo()
            ) : (
              <button
                onClick={() => setShowConnectWallet(true)}
                className=" bg-darkOrange  px-4 py-2 rounded-lg"
                disabled={isMintCapReached}
              >
                <h3 className="font-Matter text-black text-sm font-thin tracking-wide">
                  CONNECT WALLET
                </h3>
              </button>
            )}
          </div>
        </div>
      </header>
      <AnimatePresence>
        {showConnectWallet && (
          <ConnectWallet onClose={() => setShowConnectWallet(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
