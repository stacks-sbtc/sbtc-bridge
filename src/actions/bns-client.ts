"use server";

import { getOwner, fetchUserOwnedNames } from "bns-v2-sdk";
import { env } from "@/env";

export type NetworkType = "mainnet" | "testnet";

export async function bnsNameToAddress(name: string): Promise<string | null> {
  const network: NetworkType = getNetwork();
  return getOwner({
    fullyQualifiedName: name,
    network,
  });
}

export async function addressToBnsName(
  address: string,
): Promise<Array<{ name: string; namespace: string }>> {
  const network: NetworkType = getNetwork();
  return fetchUserOwnedNames({
    senderAddress: address,
    network: network,
  });
}

function getNetwork(): NetworkType {
  return env.WALLET_NETWORK !== "mainnet" ? "testnet" : env.WALLET_NETWORK;
}
