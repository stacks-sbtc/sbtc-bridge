"use client";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { bridgeConfigAtom } from "@/util/atoms";
import { parseSbtcBalance } from "@/util/balance-utils";

export function useSBTCBalance({ address }: { address?: string }) {
  const [data, setData] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const { STACKS_API_URL, SBTC_CONTRACT_DEPLOYER } =
    useAtomValue(bridgeConfigAtom);

  useEffect(() => {
    if (!address || !STACKS_API_URL || !SBTC_CONTRACT_DEPLOYER) return;

    const fetchBalance = async () => {
      setIsLoading(true);

      try {
        const url = `${STACKS_API_URL}/extended/v2/addresses/${address}/balances/ft`;
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          setData(BigInt(0));
          return;
        }

        const result = await response.json();
        setData(parseSbtcBalance(result, SBTC_CONTRACT_DEPLOYER));
      } catch {
        setData(BigInt(0));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address, STACKS_API_URL, SBTC_CONTRACT_DEPLOYER]);

  return { data, isLoading };
}
