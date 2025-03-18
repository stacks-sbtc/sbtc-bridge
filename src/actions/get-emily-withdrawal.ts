"use server";

import { env } from "@/env";
import getBitcoinNetwork from "@/util/get-bitcoin-network";
import * as bitcoin from "bitcoinjs-lib";
import { hexToBytes } from "@stacks/common";
import ecc from "@bitcoinerlab/secp256k1";
import { WithdrawalStatus } from "@/app/withdraw/[txid]/components/util";

bitcoin.initEccLib(ecc);

type EmilyWithdrawal = {
  requestId: number;
  stacksBlockHash: string;
  stacksBlockHeight: number;
  recipient: string;
  sender: string;
  amount: number;
  lastUpdateHeight: number;
  lastUpdateBlockHash: string;
  status: string;
  statusMessage: string;
  parameters: Parameters;
  fulfillment?: Fulfillment;
};

type Parameters = {
  maxFee: number;
};

type Fulfillment = {
  BitcoinTxid: string;
  BitcoinTxIndex: number;
  StacksTxid: string;
  BitcoinBlockHash: string;
  BitcoinBlockHeight: number;
  BtcFee: number;
};

export async function getEmilyWithdrawal(requestId: string) {
  const withdrawal = await fetch(`${env.EMILY_URL}/withdrawal/${requestId}`);

  if (!withdrawal.ok) {
    throw new Error(`Failed to fetch withdrawal data: ${withdrawal.status}`);
  }
  const { status, amount, recipient } =
    (await withdrawal.json()) as EmilyWithdrawal;
  const bitcoinNetwork = getBitcoinNetwork(env.WALLET_NETWORK);
  return {
    address: bitcoin.address.fromOutputScript(
      hexToBytes(recipient),
      bitcoinNetwork,
    ),
    amount: amount,
    status: WithdrawalStatus[status as WithdrawalStatus],
    requestId,
  };
}
