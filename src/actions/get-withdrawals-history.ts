"use server";
import { WithdrawalStatus } from "@/app/_withdraw/[txid]/components/util";
import { env } from "@/env";
export interface withdrawlsResponse {
  nextToken: any;
  withdrawals: Withdrawal[];
}

export interface Withdrawal {
  requestId: number;
  stacksBlockHash: string;
  stacksBlockHeight: number;
  recipient: string;
  sender: string;
  amount: number;
  lastUpdateHeight: number;
  lastUpdateBlockHash: string;
  status: WithdrawalStatus;
  txid: string;
}

export const getWithdrawalsHistory = async (stxAddress?: string) => {
  if (!stxAddress) {
    return [];
  }
  const response = await fetch(
    `${env.EMILY_URL}/withdrawal/sender/${stxAddress}`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch withdrawals history for address ${stxAddress}`,
    );
  }

  const data: withdrawlsResponse = await response.json();
  return data.withdrawals;
};
