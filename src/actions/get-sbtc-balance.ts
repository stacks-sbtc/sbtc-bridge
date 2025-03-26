"use server";
import {
  Cl,
  fetchCallReadOnlyFunction,
  ResponseOkCV,
  UIntCV,
} from "@stacks/transactions";
import { env } from "@/env";
import { getStacksNetwork } from "@/util/get-stacks-network";
import { hiroClient } from "./hiro-fetch";

/**
 *
 * @description gets the total sbtc balance of an address this includes both locked and available sbtc
 */
export default async function getSbtcTotalBalance({
  address,
}: {
  address: string;
}) {
  const { WALLET_NETWORK, SBTC_CONTRACT_DEPLOYER } = env;
  const network = getStacksNetwork(WALLET_NETWORK);

  const response = (await fetchCallReadOnlyFunction({
    contractAddress: SBTC_CONTRACT_DEPLOYER!,
    contractName: "sbtc-token",
    functionName: "get-balance-available",
    functionArgs: [Cl.address(address)],
    network: network,
    senderAddress: address,
    client: hiroClient,
  })) as ResponseOkCV<UIntCV>;

  return response.value.value;
}
