"use client";

import { useSBTCBalance } from "@/hooks/use-sbtc-balance";

export default function SBTCBalance({ address }: { address: string }) {
  const { data } = useSBTCBalance({ address });

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center font-bold text-darkGray font-Matter text-sm">
        Balance: {data !== undefined ? Number(data) / 1e8 : "..."} sBTC
      </div>
    </div>
  );
}
