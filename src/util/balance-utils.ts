export function parseBtcBalance(response: unknown): number {
  try {
    const data = response as {
      chain_stats?: { funded_txo_sum?: number; spent_txo_sum?: number };
    };
    const funded = data?.chain_stats?.funded_txo_sum ?? 0;
    const spent = data?.chain_stats?.spent_txo_sum ?? 0;
    return (funded - spent) / 1e8;
  } catch {
    return 0;
  }
}

export function parseSbtcBalance(
  response: unknown,
  contractDeployer: string
): bigint {
  try {
    const data = response as {
      results?: Array<{ token: string; balance: string }>;
    };
    const sbtcTokenId = `${contractDeployer}.sbtc-token::sbtc-token`;
    const sbtcToken = data?.results?.find((r) => r.token === sbtcTokenId);

    if (sbtcToken?.balance) {
      return BigInt(sbtcToken.balance);
    }
    return BigInt(0);
  } catch {
    return BigInt(0);
  }
}

