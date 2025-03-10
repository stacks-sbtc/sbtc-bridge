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
  return (
    minimumDeposit && (
      <span className="opacity-60">
        How much BTC are you transferring over to sBTC? Enter an amount that’s
        above the minimum (
        {minimumDeposit.toLocaleString(undefined, { maximumFractionDigits: 8 })}{" "}
        BTC)
      </span>
    )
  );
}
