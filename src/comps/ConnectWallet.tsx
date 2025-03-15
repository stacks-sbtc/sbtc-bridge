import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";
import {
  bridgeConfigAtom,
  showTosAtom,
  walletInfoAtom,
  WalletProvider,
} from "@/util/atoms";
import {
  checkAvailableWallets,
  getAddressesLeather,
  getAddressesXverse,
} from "@/util/wallet-utils";
import { useAtomValue, useSetAtom } from "jotai";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationStatusType } from "./Notifications";
import {
  getAddresses,
  getAddressesAsigna,
  getAddressesFordefi,
} from "@/util/wallet-utils/src/getAddress";
import { useAsignaConnect } from "@asigna/btc-connect";
import { getStacksAddressInfo } from "@/util/get-stacks-address-info";

const WALLET_PROVIDERS = [
  {
    image: "/images/leather.svg",
    name: "Leather",
    walletProvider: WalletProvider.LEATHER,
    installUrl: "https://leather.io",
  },
  {
    image: "/images/xverse.svg",
    name: "Xverse",
    walletProvider: WalletProvider.XVERSE,
    installUrl: "https://xverse.app",
  },
  {
    image: "/images/AsignaMultisig.svg",
    name: "Asigna Multisig",
    walletProvider: WalletProvider.ASIGNA,
    installUrl: "https://btc.asigna.io",
  },
  {
    image: "/images/fordefi.svg",
    name: "Fordefi",
    walletProvider: WalletProvider.FORDEFI,
    installUrl: "https://www.fordefi.com/",
  },
];

const isMainnetWallet = (addresses: Awaited<ReturnType<getAddresses>>) => {
  const bitcoinAddress = addresses.payment?.address;
  const stacksAddress = addresses.stacks?.address;

  if (bitcoinAddress) {
    return /^(3|bc1)/.test(bitcoinAddress);
  }

  if (stacksAddress) {
    const addressData = getStacksAddressInfo(stacksAddress);
    if (addressData.valid) {
      return addressData.type === "mainnet";
    }
  }
  return null;
};

type ConnectWalletProps = {
  onClose: () => void;
};
const ConnectWallet = ({ onClose }: ConnectWalletProps) => {
  const availableWallets = checkAvailableWallets();

  const setWalletInfo = useSetAtom(walletInfoAtom);

  const setShowTos = useSetAtom(showTosAtom);

  const { notify } = useNotifications();
  const { WALLET_NETWORK } = useAtomValue(bridgeConfigAtom);
  const { connect: asignaConnect } = useAsignaConnect();

  const handleSelectWallet = async (wallet: WalletProvider) => {
    try {
      let addresses: Awaited<ReturnType<getAddresses>> | null = null;
      switch (wallet) {
        case WalletProvider.LEATHER:
          addresses = await getAddressesLeather();
          break;
        case WalletProvider.XVERSE:
          addresses = await getAddressesXverse();
          break;
        case WalletProvider.FORDEFI:
          addresses = await getAddressesFordefi();
          break;
        case WalletProvider.ASIGNA:
          addresses = await getAddressesAsigna({ action: asignaConnect });
      }
      // in the case of fordefi and asigna
      // we might have only one of the addresses
      const isMainnetAddress = isMainnetWallet(addresses);
      // null means we couldn't get any address at all
      if (isMainnetAddress === null) {
        throw new Error("Could not determine wallet address");
      }
      if (WALLET_NETWORK !== "mainnet" && isMainnetAddress) {
        throw new Error(`Please switch to ${WALLET_NETWORK} network`);
      } else if (WALLET_NETWORK === "mainnet" && !isMainnetAddress) {
        throw new Error(
          `Please switch to ${WALLET_NETWORK} network and use a segwit address`,
        );
      }

      setWalletInfo({
        selectedWallet: wallet,
        addresses: addresses,
      });
      onClose();

      setShowTos(true);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        error = error.message;
      }
      notify({
        message: String(error),
        type: NotificationStatusType.ERROR,
        expire: 10000,
      });
    }
  };

  return (
    <motion.div
      initial={{ x: "0", opacity: 0 }}
      animate={{ x: "0", opacity: 1 }}
      onClick={() => onClose()}
      className="fixed inset-0 bg-black text-black dark:text-white bg-opacity-50 flex items-center justify-center md:p-4 z-20"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFF5EB] dark:bg-reskin-dark-gray rounded-lg flex flex-col items-center justify-between p-6 w-full h-screen sm:h-[500px] sm:w-[340px]  shadow-lg"
      >
        <div className="w-full flex flex-col gap-2 items-center justify-center mb-4">
          <h1 className="text-3xl font-normal">Connect Wallet</h1>
          <p className="font-thin text-sm">To Start Using the Bridge</p>
        </div>
        <Image
          src="/images/StacksBitcoin.svg"
          alt="Stacks Bitcoin"
          width={150}
          height={150}
        />
        <div className="w-full flex flex-col gap-4 items-center justify-center">
          {WALLET_PROVIDERS.map((provider, index) => {
            const available = availableWallets[provider.walletProvider];
            const openInstall = () => {
              if (available) {
                handleSelectWallet(provider.walletProvider);
              } else {
                window.open(provider.installUrl, "_blank");
              }
            };

            return (
              <button
                type="button"
                key={`wallet-${index}-${provider.walletProvider}`}
                onClick={openInstall}
                className={
                  "font-Matter flex w-full items-center justify-between p-3 hover:bg-gray-100 rounded cursor-pointer transition"
                }
              >
                <div className="flex items-center">
                  <Image
                    className={
                      (available ? "" : "opacity-50 grayscale ") + "rounded"
                    }
                    src={provider.image}
                    height={48}
                    width={48}
                    alt={provider.name}
                  />
                  <p className="ml-4">
                    {provider.walletProvider === WalletProvider.ASIGNA &&
                    !available ? (
                      "Open as an embedded app in Asigna"
                    ) : (
                      <>
                        {provider.name}
                        {""}
                        {!available && " is not available click to install"}
                      </>
                    )}
                  </p>
                </div>
                {available ? (
                  <ArrowRightIcon className="h-6 w-6" />
                ) : (
                  <ArrowUpRightIcon className="h-8 w-8" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConnectWallet;
