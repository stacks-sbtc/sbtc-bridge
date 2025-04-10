import getEmilyLimits from "@/actions/get-emily-limits";
import yup from "yup";
type EmilyLimits = Awaited<ReturnType<typeof getEmilyLimits>>;

const getMaxError = (maxWithdrawal: number) => {
  return `Withdrawal exceeds current cap of ${maxWithdrawal.toLocaleString(undefined, { maximumFractionDigits: 8 })} BTC`;
};
function convertBTCtoSats(btcValue: number) {
  return btcValue * 1e8;
}

function checkWithdrawalCap(
  this: yup.TestContext<yup.AnyObject>,
  satsValue: number,
  emilyLimits: EmilyLimits | undefined,
) {
  if (
    emilyLimits?.perWithdrawalCap &&
    satsValue > emilyLimits.perWithdrawalCap
  ) {
    return this.createError({
      path: this.path,
      message: getMaxError(emilyLimits.perWithdrawalCap / 1e8),
    });
  }
  return true;
}

function checkAvailableToWithdraw(
  this: yup.TestContext<yup.AnyObject>,
  satsValue: number,
  emilyLimits: EmilyLimits | undefined,
) {
  if (
    emilyLimits?.availableToWithdraw &&
    satsValue > emilyLimits.availableToWithdraw
  ) {
    return this.createError({
      path: this.path,
      message: getMaxError(emilyLimits.availableToWithdraw / 1e8),
    });
  }
  return true;
}

function checkWithdrawableBalance(
  this: yup.TestContext<yup.AnyObject>,
  btcValue: number,
  btcBalance: number,
  fee: number,
) {
  const maxWithdrawableBalance = btcBalance - fee;
  if (btcValue > maxWithdrawableBalance) {
    return this.createError({
      path: this.path,
      message: formatBalanceError(btcValue, fee, btcBalance),
    });
  }
  return true;
}

function formatBalanceError(btcValue: number, fee: number, btcBalance: number) {
  return `The withdrawal + max fees (${(fee + btcValue).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 8,
    },
  )}) amount exceeds your current balance of ${btcBalance.toLocaleString(
    undefined,
    {
      maximumFractionDigits: 8,
    },
  )} sBTC`;
}

// Main validation function
export function validateWithdrawal(
  this: yup.TestContext<yup.AnyObject>,
  btcValue: number | undefined,
  emilyLimits: EmilyLimits | undefined,
  btcBalance: number,
  fee: number,
) {
  if (!btcValue) return true;

  const satsValue = convertBTCtoSats(btcValue);

  const capCheck = checkWithdrawalCap.call(this, satsValue, emilyLimits);
  if (capCheck !== true) return capCheck;

  const availableCheck = checkAvailableToWithdraw.call(
    this,
    satsValue,
    emilyLimits,
  );
  if (availableCheck !== true) return availableCheck;

  const balanceCheck = checkWithdrawableBalance.call(
    this,
    btcValue,
    btcBalance,
    fee,
  );
  if (balanceCheck !== true) return balanceCheck;

  return true;
}
