"use server";

import { env } from "@/env";
type EmilyLimits = {
  pegCap: null | number;
  perDepositCap: null | number;
  perWithdrawalCap: null | number;
  accountCaps: AccountCaps;
  perDepositMinimum: null | number;
  availableToWithdraw: number | null;
};

type AccountCaps = {};

function developmentFallback() {
  return {
    pegCap: Infinity,
    perDepositCap: Infinity,
    perWithdrawalCap: Infinity,
    perDepositMinimum: 0,
    availableToWithdraw: Infinity,
  };
}

function productionFallback() {
  return {
    pegCap: 0,
    perDepositCap: 0,
    perWithdrawalCap: 0,
    perDepositMinimum: Infinity,
    availableToWithdraw: 0,
  };
}

export default async function getEmilyLimits() {
  if (
    env.DEV_FORCE_OPEN_LIMITS &&
    process.env.NODE_ENV === "development"
  ) {
    return developmentFallback();
  }

  try {
    if (!env.EMILY_URL) {
      throw new Error("EMILY_URL is not configured");
    }

    const res = await fetch(`${env.EMILY_URL}/limits`);
    if (!res.ok) {
      throw new Error(`Failed to fetch limits: ${res.status}`);
    }

    const json = (await res.json()) as EmilyLimits;
    // exclude account caps
    return {
      pegCap: json.pegCap ?? Infinity,
      perDepositCap: json.perDepositCap ?? Infinity,
      perWithdrawalCap: json.perWithdrawalCap ?? Infinity,
      perDepositMinimum: json.perDepositMinimum ?? 0,
      availableToWithdraw: json.availableToWithdraw ?? Infinity,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[getEmilyLimits] falling back to development defaults",
        error,
      );
      return developmentFallback();
    }
    return productionFallback();
  }
}
