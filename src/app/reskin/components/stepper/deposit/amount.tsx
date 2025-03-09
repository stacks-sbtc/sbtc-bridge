import getEmilyLimits from "@/actions/get-emily-limits";
import { useQuery } from "@tanstack/react-query";

export function AmountDescription({}) {
  const { data: minimumDeposit } = useQuery({
    queryKey: ["emilyLimits"],
    queryFn: async () => {
      const response = await getEmilyLimits();
      const isUnlimited = response.perDepositMinimum === 0;
      // to handle devenv situations
      return isUnlimited ? 0.0001 : response.perDepositMinimum;
    },
  });
  return (
    minimumDeposit && (
      <span className="opacity-60">
        How much BTC are you transferring over to sBTC? Enter an amount that’s
        above the minimum ({minimumDeposit} BTC)
      </span>
    )
  );
}
