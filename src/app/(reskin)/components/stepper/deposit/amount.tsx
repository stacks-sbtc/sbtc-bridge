import getEmilyLimits from "@/actions/get-emily-limits";
import { useQuery } from "@tanstack/react-query";

export function AmountDescription({}) {
  const { data: minimumDeposit } = useQuery({
    queryKey: ["emilyLimits"],
    queryFn: async () => {
      const response = await getEmilyLimits();
      const isUnlimited = response.perDepositMinimum === 0;
      // to handle devenv situations
      return isUnlimited ? 0.00000001 : response.perDepositMinimum / 1e8;
    },
  });
  const sats = minimumDeposit * 1e8;
  return (
    minimumDeposit && (
      <span className="md:opacity-60 px-4 md:px-0">
        How much BTC are you transferring over to sBTC? Enter an amount that's
        above the minimum (
        {sats.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
        sat{sats === 1 ? "" : "s"})
      </span>
    )
  );
}
