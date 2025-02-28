"use server";

import { env } from "@/env";
import { getStacksNetwork } from "@/util/get-stacks-network";
import {
  broadcastTransaction,
  deserializeTransaction,
} from "@stacks/transactions";

export async function serverBroadcastTx({ txHex }: { txHex: string }) {
  const network = getStacksNetwork(env.WALLET_NETWORK);
  const tx = deserializeTransaction(txHex);
  return broadcastTransaction({
    transaction: tx,
    network: network,
    client: {
      baseUrl: env.STACKS_API_URL,
    },
  });
}
