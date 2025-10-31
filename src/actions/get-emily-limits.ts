"use server";

import { env } from "@/env";

type EmilyLimits = {
  pegCap: null | number;
  perDepositCap: null | number;
  perWithdrawalCap: null | number;
  accountCaps: Record<string, unknown>;
  perDepositMinimum: null | number;
  availableToWithdraw: number | null;
};

let cachedValue: Awaited<ReturnType<typeof getEmilyLimitsInner>> | null = null;
let lastFetchTime = 0; // in ms

async function getEmilyLimitsInner() {
  const res = await fetch(`${env.EMILY_URL}/limits`);
  if (!res.ok) {
    return {
      pegCap: 0,
      perDepositCap: 0,
      perWithdrawalCap: 0,
      perDepositMinimum: Infinity,
      availableToWithdraw: 0,
    };
  }

  const json = (await res.json()) as EmilyLimits;
  return {
    pegCap: json.pegCap ?? Infinity,
    perDepositCap: json.perDepositCap ?? Infinity,
    perWithdrawalCap: json.perWithdrawalCap ?? Infinity,
    perDepositMinimum: json.perDepositMinimum ?? 0,
    availableToWithdraw: json.availableToWithdraw ?? Infinity,
  };
}

export default async function getEmilyLimits() {
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  if (cachedValue && now - lastFetchTime < TEN_MINUTES) {
    // Return cached value if fetched less than 10 minutes ago
    return cachedValue;
  }

  // Otherwise, fetch new value and update cache
  const newValue = await getEmilyLimitsInner();
  cachedValue = newValue;
  lastFetchTime = now;
  return newValue;
}
