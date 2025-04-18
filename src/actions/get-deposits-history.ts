"use server";

import { env } from "@/env";
import type { DepositStatus } from "@/hooks/use-deposit-status";

export interface depositResponse {
  nextToken: any;
  deposits: Deposit[];
}

export interface Deposit {
  bitcoinTxid: string;
  bitcoinTxOutputIndex: number;
  recipient: string;
  amount: number;
  lastUpdateHeight: number;
  lastUpdateBlockHash: string;
  status: DepositStatus;
  reclaimScript: string;
  depositScript: string;
}

export async function getDepositsHistory(reclaimPubkeys: string[]) {
  console.log(
    `${env.EMILY_URL}/deposit/reclaim-pubkeys/${reclaimPubkeys.join("-")}`,
  );
  const response = await fetch(
    `${env.EMILY_URL}/deposit/reclaim-pubkeys/${reclaimPubkeys.join("-")}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch deposits history: ${response.statusText}`);
  }

  const data: depositResponse = await response.json();
  return data.deposits;
}
