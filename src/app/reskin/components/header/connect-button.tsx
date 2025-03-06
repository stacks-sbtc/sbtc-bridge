import ConnectWallet from "@/comps/ConnectWallet";
import { showConnectWalletAtom, walletInfoAtom } from "@/util/atoms";
import { AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";

export const ConnectButton = () => {
  const [showConnectWallet, setShowConnectWallet] = useAtom(
    showConnectWalletAtom,
  );
  const [walletInfo, setWalletInfo] = useAtom(walletInfoAtom);
  const isConnected = !!walletInfo.selectedWallet;
  const handleConnectButton = () => {
    if (!isConnected) {
      return setShowConnectWallet(true);
    }
    setWalletInfo({
      selectedWallet: null,
      addresses: {
        payment: null,
        taproot: null,
        stacks: null,
        musig: null,
      },
    });
  };

  return (
    <>
      <button
        onClick={handleConnectButton}
        className="bg-[#FC6432] px-4 py-2 rounded-lg uppercase text-sm dark:text-black"
      >
        {isConnected ? "Disconnect" : "Connect Wallet"}
      </button>
      <AnimatePresence>
        {showConnectWallet && (
          <ConnectWallet onClose={() => setShowConnectWallet(false)} />
        )}
      </AnimatePresence>
    </>
  );
};
