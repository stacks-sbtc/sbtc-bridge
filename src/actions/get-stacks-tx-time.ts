"use server";

import { env } from "@/env";
import { hiroClient } from "./hiro-fetch";

export async function getStacksTxTime(txid: string): Promise<number> {
  const response = await hiroClient.fetch(
    `${env.STACKS_API_URL}/extended/v1/tx/${txid}`,
    {
      cache: "force-cache",
    },
  );
  const data = await response.json();
  return data.block_time;
}
