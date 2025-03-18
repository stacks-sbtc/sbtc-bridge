"use server";

import { env } from "@/env";
import { mempoolFetchUntilOk } from "./mempool-api";

type mempoolFeesRes = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

const MAX_WITHDRAWAL_TX_SIZE = 320;

export const getWithdrawalMaxFee = async () => {
  const currentMempoolFees = (await mempoolFetchUntilOk(
    `${env.MEMPOOL_API_URL}/v1/fees/recommended`,
  ).then((res) => res.json())) as mempoolFeesRes;

  return 4 * currentMempoolFees.fastestFee * MAX_WITHDRAWAL_TX_SIZE;
};
