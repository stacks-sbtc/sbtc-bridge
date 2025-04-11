import getEmilyLimits from "@/actions/get-emily-limits";
import yup from "yup";
type EmilyLimits = Awaited<ReturnType<typeof getEmilyLimits>>;

export function formatBTC(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

const getCapError = (maxWithdrawal: number) => {
  return `Withdrawal exceeds current cap of ${formatBTC(maxWithdrawal)} BTC`;
};

const getAvailableError = (available: number) => {
  return `Withdrawal exceeds available quota of ${formatBTC(available)} BTC for this period`;
};

function convertBTCtoSats(btcValue: number) {
  return btcValue * 1e8;
}

function checkWithdrawalCap(
  this: yup.TestContext<yup.AnyObject>,
  satsValue: number,
  emilyLimits: EmilyLimits,
) {
  if (satsValue > emilyLimits.perWithdrawalCap) {
    return this.createError({
      path: this.path,
      message: getCapError(emilyLimits.perWithdrawalCap / 1e8),
    });
  }
  return true;
}

function checkAvailableToWithdraw(
  this: yup.TestContext<yup.AnyObject>,
  satsValue: number,
  emilyLimits: EmilyLimits,
) {
  if (satsValue > emilyLimits.availableToWithdraw) {
    return this.createError({
      path: this.path,
      message: getAvailableError(emilyLimits.availableToWithdraw / 1e8),
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
  return `The withdrawal + max fees (${formatBTC(
    fee + btcValue,
  )}) amount exceeds your current balance of ${formatBTC(btcBalance)} sBTC`;
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

  if (!emilyLimits) {
    return this.createError({
      path: this.path,
      message: "Could not fetch withdrawal limits, please try again later",
    });
  }

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
