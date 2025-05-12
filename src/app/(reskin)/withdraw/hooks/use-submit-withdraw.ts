import { bridgeConfigAtom, walletInfoAtom, WalletProvider } from "@/util/atoms";
import { useAtomValue } from "jotai";
import type { DefaultNetworkConfigurations } from "@leather.io/models";
import { validateBitcoinAddress } from "@/util/validate-bitcoin-address";
import { decodeBitcoinAddress } from "@/util/decode-bitcoin-address";
import { useQuery } from "@tanstack/react-query";
import { getWithdrawalMaxFee } from "@/actions/get-withdrawal-max-fee";
import {
  Cl,
  Pc,
  makeUnsignedContractCall,
  serializeTransaction,
} from "@stacks/transactions";
import { getStacksNetwork } from "@/util/get-stacks-network";
import {
  AnchorMode,
  Cl as Cl6,
  createAssetInfo,
  createFungiblePostCondition,
  FungibleConditionCode,
} from "@stacks/transactions-v6";
import { StacksNetworkName, StacksNetwork } from "@stacks/network";

import {
  callContractFordefi,
  callContractLeather,
  callContractXverse,
} from "@/util/wallet-utils";
import { useAsignaConnect } from "@asigna/stx-connect";
import { serverBroadcastTx } from "@/actions/server-broadcast-tx";
import { toast } from "sonner";
import Decimal from "decimal.js";
import { getErrorMessage } from "@/util";

const decodeBitcoinAddressToClarityRecipient = (
  address: string,
  network: DefaultNetworkConfigurations,
) => {
  if (validateBitcoinAddress(address, network)) {
    return decodeBitcoinAddress(address);
  } else {
    throw new Error(`Invalid address: ${address}`);
  }
};

export function useSubmitWithdraw() {
  const { WALLET_NETWORK, SBTC_CONTRACT_DEPLOYER } =
    useAtomValue(bridgeConfigAtom);
  const { addresses, selectedWallet } = useAtomValue(walletInfoAtom);
  const { data: maxFee } = useQuery({
    queryKey: ["maxFee"],
    queryFn: async () => {
      return getWithdrawalMaxFee();
    },
  });
  const { openAsignaContractCall } = useAsignaConnect();
  const handleSubmit = async (values: { address: string; amount: string }) => {
    const { address, amount } = values;

    if (!WALLET_NETWORK) {
      throw new Error("Invalid network");
    }
    if (!SBTC_CONTRACT_DEPLOYER) {
      throw new Error("Invalid contract deployer");
    }
    // get the proper data for the address
    const recipient = decodeBitcoinAddressToClarityRecipient(
      address,
      WALLET_NETWORK,
    );
    let publicKey = addresses.stacks?.publicKey;

    if (!publicKey) {
      if (selectedWallet === WalletProvider.ASIGNA) {
        // asigna only provides the stacks address
        // this workaround works so why not
        publicKey = "";
      } else {
        throw new Error("Invalid public key");
      }
    }

    // convert the amount to satoshis
    const satoshiAmount = new Decimal(amount).times(1e8).toNumber();

    // convert the fee to satoshis
    const satoshiFee = Math.round(maxFee!);

    const contractArgs = [
      Cl.uint(satoshiAmount),
      Cl.tuple({
        version: Cl.bufferFromHex(recipient.type),
        hashbytes: Cl.buffer(recipient.hash),
      }),
      Cl.uint(satoshiFee),
    ];

    const stacksNetwork = getStacksNetwork(WALLET_NETWORK);

    const opts = {
      contractAddress: SBTC_CONTRACT_DEPLOYER,
      contractName: "sbtc-withdrawal",
      functionName: "initiate-withdrawal-request",
      functionArgs: contractArgs,
      publicKey,
      network: stacksNetwork,

      postConditions: [
        Pc.principal(addresses.stacks!.address)
          .willSendLte(satoshiAmount + satoshiFee)
          .ft(`${SBTC_CONTRACT_DEPLOYER}.sbtc-token`, "sbtc-token"),
      ],
    } as any;

    if (WALLET_NETWORK !== "mainnet") {
      // fee apis break in devenv and testnet sometimes and are unreliable
      opts.fee = 10_000;
    }
    const transaction = await makeUnsignedContractCall(opts);

    const signTx = {
      [WalletProvider.XVERSE]: callContractXverse,
      [WalletProvider.LEATHER]: callContractLeather,
      [WalletProvider.FORDEFI]: callContractFordefi,
      [WalletProvider.ASIGNA]: async ({}: {
        txHex: string;
        network: StacksNetworkName | StacksNetwork;
      }) => {
        const txid = await openAsignaContractCall(
          {
            contractName: opts.contractName!,
            contractAddress: opts.contractAddress!,
            functionName: opts.functionName!,
            functionArgs: [
              Cl6.uint(satoshiAmount),
              Cl6.tuple({
                version: Cl6.bufferFromHex(recipient.type),
                hashbytes: Cl6.buffer(recipient.hash),
              }),
              Cl6.uint(satoshiFee),
            ],
            anchorMode: AnchorMode.Any,
            postConditions: [
              createFungiblePostCondition(
                addresses.stacks!.address!,
                FungibleConditionCode.LessEqual,
                satoshiAmount + satoshiFee,
                createAssetInfo(
                  SBTC_CONTRACT_DEPLOYER,
                  "sbtc-token",
                  "sbtc-token",
                ),
              ),
            ],
          },
          {
            execute: true,
          },
        );

        return txid!;
      },
    }[selectedWallet!];
    try {
      const signedTx = await signTx({
        txHex: serializeTransaction(transaction),
        network: stacksNetwork,
      });
      let txId = signedTx;
      if (selectedWallet !== WalletProvider.ASIGNA) {
        const broadcastResponse = await serverBroadcastTx({
          txHex: signedTx,
        });
        txId = broadcastResponse.txid;
      }
      return txId;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn(error);
      let errorMessage = getErrorMessage(error);
      toast.error(`Issue with Transaction: ${errorMessage}`);
    }
  };

  return handleSubmit;
}
