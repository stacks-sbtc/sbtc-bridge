import { useMemo } from "react";

export function useShortAddress(address: string) {
  return useMemo(() => {
    if (address.length > 10) {
      return `${address.slice(0, 10)}...${address.slice(-10)}`;
    }
    return address;
  }, [address]);
}
