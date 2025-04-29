import ConnectWallet from "@/comps/ConnectWallet";
import TOS from "@/comps/tos";
import {
  showConnectWalletAtom,
  showTosAtom,
  walletInfoAtom,
} from "@/util/atoms";
import { AnimatePresence } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";

export const ConnectButton = () => {
  const [showConnectWallet, setShowConnectWallet] = useAtom(
    showConnectWalletAtom,
  );
  const [walletInfo, setWalletInfo] = useAtom(walletInfoAtom);
  const showTos = useAtomValue(showTosAtom);
  const isConnected = !!walletInfo.selectedWallet;
  const handleConnectButton = () => {
    if (!isConnected) {
      return setShowConnectWallet(true);
    }
    setWalletInfo({
      selectedWallet: null,
      addresses: {
        payment: null,
        stacks: null,
        musig: null,
      },
    });
  };

  return (
    <>
      <button
        onClick={handleConnectButton}
        className="bg-orange dark:bg-dark-reskin-orange h-7 px-3 md:px-4 md:h-10 rounded-lg uppercase text-xs leading-normal md:text-sm dark:text-black font-matter-mono"
      >
        {isConnected ? "Disconnect" : "Connect Wallet"}
      </button>
      <AnimatePresence>
        {showConnectWallet && (
          <ConnectWallet onClose={() => setShowConnectWallet(false)} />
        )}
        {showTos && <TOS />}
      </AnimatePresence>
    </>
  );
};
