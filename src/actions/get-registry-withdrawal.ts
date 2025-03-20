"use server";

import { env } from "@/env";
import {
  BooleanCV,
  BufferCV,
  Cl,
  ClarityType,
  fetchCallReadOnlyFunction,
  OptionalCV,
  PrincipalCV,
  TupleCV,
  UIntCV,
} from "@stacks/transactions";
import { hiroClient } from "./hiro-fetch";
import { getStacksNetwork } from "@/util/get-stacks-network";
import { WithdrawalStatus } from "@/app/withdraw/[txid]/components/util";
import getBitcoinNetwork from "@/util/get-bitcoin-network";
import { encodeBitcoinAddress } from "@/util/decode-bitcoin-address";

type RegistryWithdrawal = OptionalCV<
  TupleCV<{
    amount: UIntCV;
    "block-height": UIntCV;
    "max-fee": UIntCV;
    recipient: TupleCV<{
      hashbytes: BufferCV;
      version: BufferCV;
    }>;
    sender: PrincipalCV;
    status: OptionalCV<BooleanCV>;
  }>
>;

export async function getRegistryWithdrawal(id: string) {
  const res = (await fetchCallReadOnlyFunction({
    contractAddress: env.SBTC_CONTRACT_DEPLOYER!,
    contractName: "sbtc-registry",
    functionName: "get-withdrawal-request",
    functionArgs: [Cl.uint(id)],
    network: getStacksNetwork(env.WALLET_NETWORK),
    senderAddress: env.SBTC_CONTRACT_DEPLOYER!,
    client: hiroClient,
  })) as RegistryWithdrawal;

  if (res.type === ClarityType.OptionalNone) {
    throw new Error("Withdrawal not found");
  }
  const _status = res.value.value.status;
  let status = WithdrawalStatus.pending;

  if (_status.type === ClarityType.OptionalSome) {
    const isSuccessful = _status.value.type === ClarityType.BoolTrue;
    status = isSuccessful
      ? WithdrawalStatus.confirmed
      : WithdrawalStatus.failed;
  }

  const recipient = res.value.value.recipient.value;

  const address = encodeBitcoinAddress(
    recipient.hashbytes.value,
    recipient.version.value,
    getBitcoinNetwork(env.WALLET_NETWORK),
  );
  return {
    status,
    address,
    amount: Number(res.value.value.amount.value),
    requestId: id,
  };
}
