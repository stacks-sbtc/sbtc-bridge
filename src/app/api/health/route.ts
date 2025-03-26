import { env } from "@/env";
import packageJson from "../../../../package.json";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  return NextResponse.json(
    {
      result: {
        version: packageJson.version,
        contracts_deployer: env.SBTC_CONTRACT_DEPLOYER,
        git_commit: env.GIT_COMMIT || "unknown",
      },
    },
    { status: 200 },
  );
}

export const dynamic = "force-dynamic";
