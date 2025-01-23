"use server";

import { env } from "@/env";
type EmilyLimits = {
  pegCap: null | number;
  perDepositCap: null | number;
  perWithdrawalCap: null | number;
  accountCaps: AccountCaps;
  perDepositMinimum: null | number;
};

type AccountCaps = {};

export default async function getEmilyLimits() {
  const res = await fetch(`${env.EMILY_URL}/limits`);
  const json = (await res.json()) as EmilyLimits;
  // exclude account caps
  return {
    pegCap: json.pegCap || 0,
    perDepositCap: json.perDepositCap || 0,
    perWithdrawalCap: json.perWithdrawalCap || 0,
    perDepositMinimum: json.perDepositMinimum || Infinity,
  };
}
