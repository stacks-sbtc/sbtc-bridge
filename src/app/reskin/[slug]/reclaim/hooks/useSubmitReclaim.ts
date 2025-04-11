import { transmitRawTransaction } from "@/actions/bitcoinClient";
import { useReskinDepositStatus } from "@/app/reskin/hooks/use-reskin-deposit-status";
import { bridgeConfigAtom, walletInfoAtom, WalletProvider } from "@/util/atoms";
import {
  constructPsbtForReclaim,
  createTransactionFromHex,
  finalizePsbt,
} from "@/util/reclaimHelper";
import {
  signPSBTFordefi,
  signPSBTLeather,
  SignPSBTParams,
  signPSBTXverse,
} from "@/util/wallet-utils/src/sign-psbt";
import { useAsignaConnect } from "@asigna/btc-connect";
import { useMutation } from "@tanstack/react-query";
import { Psbt } from "bitcoinjs-lib";
import { useAtomValue } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// const MAX_TX_SIZE = 180;

export function useSubmitReclaim(depositTxId: string) {
  const { emilyDepositInfo } = useReskinDepositStatus(depositTxId);
  const { WALLET_NETWORK: walletNetwork } = useAtomValue(bridgeConfigAtom);
  const walletInfo = useAtomValue(walletInfoAtom);
  const { openSignPsbt } = useAsignaConnect();
  const btcAddress = walletInfo.addresses.payment?.address;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const signPsbtByWallet = async (
    walletProvider: WalletProvider,
    params: SignPSBTParams,
  ): Promise<Psbt> => {
    switch (walletProvider) {
      case WalletProvider.LEATHER:
        return Psbt.fromHex(await signPSBTLeather(params));

      case WalletProvider.XVERSE:
        return Psbt.fromHex(await signPSBTXverse(params));

      case WalletProvider.FORDEFI:
        return Psbt.fromHex(await signPSBTFordefi(params));

      case WalletProvider.ASIGNA:
        return (await openSignPsbt(Psbt.fromHex(params.hex).toBase64(), {
          onlyFinalize: false,
          execute: false,
        })) as unknown as Psbt;

      default:
        throw new Error(`Unsupported wallet provider: ${walletProvider}`);
    }
  };
  const signPSBT = async (psbtHex: string) => {
    const signedPsbt = await signPsbtByWallet(walletInfo.selectedWallet!, {
      hex: psbtHex,
      address: walletInfo.addresses.payment!.address,
      network: walletNetwork,
    });
    const finalizedTxHex = finalizePsbt(signedPsbt);
    return finalizedTxHex;
  };

  const sendReclaimTransaction = useMutation({
    mutationKey: ["sendReclaimTransaction", depositTxId],
    mutationFn: async () => {
      try {
        // FIXME: move to env
        const maxReclaimFee = 5000;

        if (!emilyDepositInfo) {
          return toast.error("Deposit not found, please refresh the page");
        }

        if (!btcAddress) {
          return toast.error("Please connect your wallet");
        }

        // FIXME: move to util or its own file
        const unsignedTxHex = constructPsbtForReclaim({
          depositAmount: emilyDepositInfo.amount,
          feeAmount: maxReclaimFee,
          lockTime: emilyDepositInfo.parameters.lockTime,
          depositScript: emilyDepositInfo.depositScript,
          reclaimScript: emilyDepositInfo.reclaimScript,
          txId: emilyDepositInfo.bitcoinTxid,
          vout: emilyDepositInfo.bitcoinTxOutputIndex,
          bitcoinReturnAddress: btcAddress,
          walletNetwork,
        });

        const txHex = await signPSBT(unsignedTxHex);
        const broadcastTransaction = await transmitRawTransaction(txHex);

        if (!broadcastTransaction) {
          toast.error("Error broadcasting transaction");
          return;
        }
        toast.success("Transaction broadcasted successfully");

        const transactionId = createTransactionFromHex(txHex);

        // set a query params to the transaction id as reclaimTxId and updated the status

        const search = new URLSearchParams(searchParams);
        search.set("reclaim_tx_id", transactionId);
        router.push(pathname + "?" + search.toString());
      } catch (err: any) {
        // expected debug info
        // eslint-disable-next-line no-console
        console.error("Error building reclaim transaction", err);
        toast.error(
          err?.error?.message ||
            err?.message ||
            "Error building reclaim transaction",
        );
      }
    },
  });
  return sendReclaimTransaction;
}
