"use server";

import { env } from "@/env";
type EmilyLimits = {
  pegCap: null | number;
  perDepositCap: null | number;
  perWithdrawalCap: null | number;
  accountCaps: AccountCaps;
  perDepositMinimum: null | number;
  rollingWithdrawalBlocks: number | null;
  rollingWithdrawalCap: number | null;
};

type AccountCaps = {};

export default async function getEmilyLimits() {
  const res = await fetch(`${env.EMILY_URL}/limits`);
  if (!res.ok) {
    return {
      pegCap: 0,
      perDepositCap: 0,
      perWithdrawalCap: 0,
      perDepositMinimum: Infinity,
    };
  }
  const json = (await res.json()) as EmilyLimits;
  // exclude account caps
  return {
    pegCap: json.pegCap ?? Infinity,
    perDepositCap: json.perDepositCap ?? Infinity,
    perWithdrawalCap: json.perWithdrawalCap ?? Infinity,
    perDepositMinimum: json.perDepositMinimum ?? 0,
    rollingWithdrawalBlocks: json.rollingWithdrawalBlocks ?? Infinity,
    rollingWithdrawalCap: json.rollingWithdrawalCap ?? Infinity,
  };
}
