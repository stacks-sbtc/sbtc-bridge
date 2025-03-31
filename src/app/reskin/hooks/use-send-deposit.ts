import { getAggregateKey } from "@/actions/get-aggregate-key";
import {
  bridgeConfigAtom,
  depositMaxFeeAtom,
  walletInfoAtom,
  WalletProvider,
} from "@/util/atoms";
import {
  createDepositAddress,
  createDepositScript,
  createReclaimScript,
} from "@/util/depositRequest";
import { useEmilyDeposit } from "@/util/use-emily-deposit";
import { useAsignaConnect } from "@asigna/btc-connect";
import { Cl } from "@stacks/transactions";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { bytesToHex, hexToBytes } from "@stacks/common";
import getBitcoinNetwork from "@/util/get-bitcoin-network";
import { sendBTCLeather, sendBTCXverse } from "@/util/wallet-utils";
import { sendBTCFordefi } from "@/util/wallet-utils/src/sendBTC";
import { toast } from "sonner";

export function useSendDeposit() {
  const { WALLET_NETWORK: walletNetwork, RECLAIM_LOCK_TIME: lockTime } =
    useAtomValue(bridgeConfigAtom);

  const { data: signersAggregatePubKey } = useQuery({
    queryKey: ["signers-aggregate-key"],
    queryFn: async () => {
      return (await getAggregateKey()).slice(2);
    },
  });
  const maxFee = useAtomValue(depositMaxFeeAtom);
  const config = useAtomValue(bridgeConfigAtom);
  const { notifyEmily, isPending } = useEmilyDeposit();

  const { openSignBtcAmount } = useAsignaConnect();

  const walletInfo = useAtomValue(walletInfoAtom);
  const depositToAddress = async ({
    stxAddress,
    amount,
  }: {
    stxAddress: string;
    amount: number;
  }) => {
    try {
      let reclaimPublicKeys = [walletInfo.addresses.payment!.publicKey];
      let signatureThreshold = 1;

      if (walletInfo.selectedWallet === WalletProvider.ASIGNA) {
        const { threshold, users } = walletInfo.addresses.musig!;
        signatureThreshold = threshold;
        reclaimPublicKeys = users.map((user) => user.publicKey);
      }

      const reclaimScript = createReclaimScript(
        Number(lockTime || "144"),
        reclaimPublicKeys,
        signatureThreshold,
      );

      const reclaimScriptHex = bytesToHex(reclaimScript);

      const serializedAddress = hexToBytes(
        Cl.serialize(Cl.principal(stxAddress)),
      );

      const depositScript = createDepositScript(
        hexToBytes(signersAggregatePubKey!),
        maxFee,
        serializedAddress,
      );

      const depositScriptHexPreHash = bytesToHex(depositScript);
      const p2trAddress = createDepositAddress({
        depositScript,
        reclaimScript,
        network: getBitcoinNetwork(config.WALLET_NETWORK),
      });

      let txId = "";

      try {
        const params = {
          recipient: p2trAddress,
          amountInSats: amount,
          network: walletNetwork,
        };
        // eslint-disable-next-line no-console
        console.log({
          preSendParams: {
            reclaimScript: reclaimScriptHex,
            depositScript: depositScriptHexPreHash,
          },
        });

        switch (walletInfo.selectedWallet) {
          case WalletProvider.LEATHER:
            txId = await sendBTCLeather(params);
            break;
          case WalletProvider.XVERSE:
            txId = await sendBTCXverse(params);
            break;
          case WalletProvider.FORDEFI:
            txId = await sendBTCFordefi(params);
            break;
          case WalletProvider.ASIGNA:
            txId = (await openSignBtcAmount(
              params,
              true,
              config.MEMPOOL_API_URL + "/",
            )) as string;
            break;
        }
      } catch (error: any) {
        let errorMessage = error;
        // eslint-disable-next-line no-console
        console.warn(error);
        if (error.error) {
          error = error.error;
        }
        if (error.message) {
          errorMessage = error.message;
        }
        toast.error(`Issue with Transaction: ${errorMessage}`);
      }

      const emilyReqPayload = {
        bitcoinTxid: txId,
        bitcoinTxOutputIndex: 0,
        reclaimScript: reclaimScriptHex,
        depositScript: depositScriptHexPreHash,
      };

      // make emily post request
      const response = await notifyEmily(emilyReqPayload);

      if (!response.ok) {
        toast.error(`Issue with Request to Emily`);

        throw new Error("Error with the request");
      }

      toast.success(`Successful Deposit request`);
      return emilyReqPayload;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      let errorMessage = error;
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(`Error while depositing funds: ${errorMessage}`);
    }
  };

  return {
    depositToAddress,
    isPending,
  };
}
