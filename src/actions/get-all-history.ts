"use server";

import { getDepositsHistory } from "./get-deposits-history";
import { getWithdrawalsHistory } from "./get-withdrawals-history";

export async function getAllHistory({
  reclaimPubkeys,
  senderStxAddress,
}: {
  reclaimPubkeys: string[];
  senderStxAddress: string;
}) {
  const depositHistory = await getDepositsHistory(reclaimPubkeys);
  const withdrawalHistory = await getWithdrawalsHistory(senderStxAddress);

  return {
    depositHistory,
    withdrawalHistory,
  };
}
