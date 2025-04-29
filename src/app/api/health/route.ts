import { env, MAX_WITHDRAWAL_TX_SIZE } from "@/env";
import packageJson from "../../../../package.json";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  return NextResponse.json(
    {
      result: {
        version: packageJson.version,
        contracts_deployer: env.SBTC_CONTRACT_DEPLOYER,
        git_commit: env.GIT_COMMIT || "unknown",
        withdrawal_fee_multiplier: env.WITHDRAWAL_FEE_MULTIPLIER,
        withdrawal_max_fee:
          MAX_WITHDRAWAL_TX_SIZE * env.WITHDRAWAL_FEE_MULTIPLIER,
      },
    },
    { status: 200 },
  );
}

export const dynamic = "force-dynamic";
