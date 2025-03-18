"use server";
import { fetchCallReadOnlyFunction, BufferCV } from "@stacks/transactions";
import { getStacksNetwork } from "../util/get-stacks-network";
import { env } from "@/env";
import { hiroClient } from "./hiro-fetch";

export async function getAggregateKey() {
  const { WALLET_NETWORK, SBTC_CONTRACT_DEPLOYER } = env;
  const network = getStacksNetwork(WALLET_NETWORK);

  const result = (await fetchCallReadOnlyFunction({
    contractName: "sbtc-registry",
    contractAddress: SBTC_CONTRACT_DEPLOYER!,
    functionName: "get-current-aggregate-pubkey",
    functionArgs: [],
    network: network,
    senderAddress: SBTC_CONTRACT_DEPLOYER!,
    client: hiroClient,
  })) as BufferCV;

  if (result.value.length < 66) {
    throw new Error("Invalid aggregate key");
  }

  return result.value;
}
