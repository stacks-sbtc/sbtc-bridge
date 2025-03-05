"use client";

import { useState } from "react";
import { FlowContainer } from "./core/FlowContainer";
import { FlowFormDynamic, NameKeysInfo } from "./core/Form";
import { Heading, SubText } from "./core/Heading";
import LandingAnimation from "./core/LandingAnimation";
import { DefaultNetworkConfigurations } from "@leather.io/models";
import { useRouter } from "next/navigation";

import { useAtomValue } from "jotai";
import { bridgeConfigAtom, walletInfoAtom, WalletProvider } from "@/util/atoms";
import {
  Cl,
  makeUnsignedContractCall,
  Pc,
  serializeTransaction,
} from "@stacks/transactions";
import { serverBroadcastTx } from "@/actions/server-broadcast-tx";
import {
  callContractAsigna,
  callContractFordefi,
  callContractLeather,
  callContractXverse,
} from "@/util/wallet-utils";
import { getStacksNetwork } from "@/util/get-stacks-network";
import { validate, Network } from "bitcoin-address-validation";
import { decodeBitcoinAddress } from "@/util/decode-bitcoin-address";

const decodeBitcoinAddressToClarityRecipient = (
  address: string,
  network: DefaultNetworkConfigurations,
) => {
  const lower = address.toLowerCase();
  const isMainnet = network === "mainnet";
  const addressNetwork = isMainnet ? Network.mainnet : Network.regtest;

  if (validate(lower, addressNetwork)) {
    return decodeBitcoinAddress(address);
  } else {
    throw new Error(`Invalid address: ${address}`);
  }
};

const data: NameKeysInfo[] = [
  {
    nameKey: "address",
    type: "text",
    initValue: "",
    placeholder: "address to receive your Bitcoin",
  },
  {
    nameKey: "amount",
    type: "number",
    initValue: "",
    placeholder: "withdraw amount",
  },
  {
    nameKey: "fee",
    type: "number",
    initValue: "0.0008",
    placeholder: "the max fee",
  },
];

const BasicWithdraw = () => {
  const [txId, setTxId] = useState<string | null>(null);
  const { addresses, selectedWallet } = useAtomValue(walletInfoAtom);
  const router = useRouter();

  const { WALLET_NETWORK, SBTC_CONTRACT_DEPLOYER } =
    useAtomValue(bridgeConfigAtom);

  const handleSubmit = async (values: Record<string, string>) => {
    console.log(values);
    const { address, amount, fee } = values;

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
    const publicKey = addresses.stacks?.publicKey;

    if (!publicKey) {
      throw new Error("Invalid public key");
    }
    console.log(recipient);

    // convert the amount to satoshis
    const satoshiAmount = Math.round(parseFloat(amount) * 1e8);
    console.log("satoshiAmount", satoshiAmount);

    // convert the fee to satoshis
    const satoshiFee = Math.round(parseFloat(fee) * 1e8);

    const contractArgs = [
      Cl.uint(satoshiAmount),
      Cl.tuple({
        version: Cl.bufferFromHex(recipient.type),
        hashbytes: Cl.buffer(recipient.hash),
      }),
      Cl.uint(satoshiFee),
    ];

    const stacksNetwork = getStacksNetwork(WALLET_NETWORK);

    const transaction = await makeUnsignedContractCall({
      contractAddress: SBTC_CONTRACT_DEPLOYER,
      contractName: "sbtc-withdrawal",
      functionName: "initiate-withdrawal-request",
      functionArgs: contractArgs,
      publicKey,
      validateWithAbi: true,
      network: stacksNetwork,
      fee: WALLET_NETWORK === "mainnet" ? undefined : 10_000,
      postConditions: [
        Pc.principal(addresses.stacks!.address)
          .willSendLte(satoshiAmount + satoshiFee)
          .ft(`${SBTC_CONTRACT_DEPLOYER}.sbtc-token`, "sbtc-token"),
      ],
    });

    const signTx = {
      [WalletProvider.XVERSE]: callContractXverse,
      [WalletProvider.LEATHER]: callContractLeather,
      [WalletProvider.FORDEFI]: callContractFordefi,
      [WalletProvider.ASIGNA]: callContractAsigna,
    }[selectedWallet!];

    const signedTx = await signTx({
      txHex: serializeTransaction(transaction),
      network: stacksNetwork,
    });

    const broadcastResponse = await serverBroadcastTx({
      txHex: signedTx,
    });
    const txId = broadcastResponse.txid;
    router.push(`/withdraw?txId=${txId}`);
    // add tx to search query for the user to have a link to the tx

    setTxId(txId);
  };

  return (
    <FlowContainer>
      <>
        <div className="w-full flex flex-row items-center justify-between">
          <Heading>Start Withdraw Transfer</Heading>
        </div>
        {txId && (
          <div className="flex flex-col gap-1">
            <SubText>Stacks TxID</SubText>
            <p className="text-black font-Matter font-semibold text-sm">
              {txId}
            </p>
          </div>
        )}
        <FlowFormDynamic
          nameKeys={data}
          handleSubmit={(values) => handleSubmit(values)}
        />
      </>
    </FlowContainer>
  );
};

const TempWithdraw = () => {
  return (
    <>
      <LandingAnimation>
        <div className="w-screen flex "></div>
        <BasicWithdraw />
        <div
          style={{
            margin: "16px 0",
          }}
        />
      </LandingAnimation>
    </>
  );
};

export default TempWithdraw;
