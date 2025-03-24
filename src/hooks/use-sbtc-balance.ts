"use client";
import getSbtcTotalBalance from "@/actions/get-sbtc-balance";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useSBTCBalance({ address }: { address?: string }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const query = useQuery({
    queryKey: ["sbtc-balance", address],
    queryFn: async () => {
      const data = await getSbtcTotalBalance({
        address: address!,
      });
      return data;
    },
    initialData: 0,
    enabled: isEnabled,
  });

  useEffect(() => {
    setIsEnabled(!!address);

    // actions are mutations that are not expected to run
    // at initial render that's why this workaround exists
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return query;
}
