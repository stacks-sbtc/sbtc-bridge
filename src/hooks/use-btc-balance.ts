"use client";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { bridgeConfigAtom } from "@/util/atoms";
import { parseBtcBalance } from "@/util/balance-utils";

export function useBTCBalance({ address }: { address?: string }) {
  const [data, setData] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { MEMPOOL_API_URL } = useAtomValue(bridgeConfigAtom);

  useEffect(() => {
    if (!address || !MEMPOOL_API_URL) return;

    const fetchBalance = async () => {
      setIsLoading(true);

      try {
        const url = `${MEMPOOL_API_URL}/address/${address}`;
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          setData(0);
          return;
        }

        const result = await response.json();
        setData(parseBtcBalance(result));
      } catch {
        setData(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address, MEMPOOL_API_URL]);

  return { data, isLoading };
}
