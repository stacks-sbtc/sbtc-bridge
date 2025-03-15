import getSbtcTotalBalance from "@/actions/get-sbtc-balance";
import { bridgeConfigAtom } from "@/util/atoms";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

export function useSBTCBalance({ address }: { address?: string }) {
  const { SBTC_CONTRACT_DEPLOYER, WALLET_NETWORK } =
    useAtomValue(bridgeConfigAtom);
  return useQuery({
    queryKey: ["sbtc-balance", address],
    queryFn: async () => {
      return await getSbtcTotalBalance({
        address: address!,
      });
    },
    initialData: 0,
    enabled: !!address && !!SBTC_CONTRACT_DEPLOYER && !!WALLET_NETWORK,
  });
}
