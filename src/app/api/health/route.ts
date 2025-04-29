import { env, MAX_WITHDRAWAL_TX_SIZE } from "@/env";
import packageJson from "../../../../package.json";
import { NextRequest, NextResponse } from "next/server";
import { DEPOSIT_MAX_FEE, RECLAIM_FEE } from "@/util/atoms";

export async function GET(_: NextRequest) {
  return NextResponse.json(
    {
      result: {
        version: packageJson.version,
        contracts_deployer: env.SBTC_CONTRACT_DEPLOYER,
        git_commit: env.GIT_COMMIT || "unknown",
        withdrawal_fee_multiplier: env.WITHDRAWAL_FEE_MULTIPLIER,
        withdrawal_max_tx_size: MAX_WITHDRAWAL_TX_SIZE,
        reclaim_lock_time: env.RECLAIM_LOCK_TIME,
        reclaim_fee: RECLAIM_FEE,
        deposit_max_fee: DEPOSIT_MAX_FEE,
      },
    },
    { status: 200 },
  );
}

export const dynamic = "force-dynamic";
