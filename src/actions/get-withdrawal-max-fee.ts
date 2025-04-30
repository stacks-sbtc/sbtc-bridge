"use server";

import { env, MAX_WITHDRAWAL_TX_SIZE } from "@/env";
import { mempoolFetchUntilOk } from "./mempool-api";

type mempoolFeesRes = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

// this is the case of a sweep tx fulfilling a single withdrawal to a p2wsh (32 bytes hash)

export const getWithdrawalMaxFee = async () => {
  const currentMempoolFees = (await mempoolFetchUntilOk(
    `${env.MEMPOOL_API_URL}/v1/fees/recommended`,
  ).then((res) => res.json())) as mempoolFeesRes;

  return (
    env.WITHDRAWAL_FEE_MULTIPLIER *
    currentMempoolFees.fastestFee *
    MAX_WITHDRAWAL_TX_SIZE
  );
};
