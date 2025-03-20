"use server";
import { env } from "@/env";

import { BufferCV, Cl, TupleCV, UIntCV } from "@stacks/transactions";

import { encodeBitcoinAddress } from "@/util/decode-bitcoin-address";
import { WithdrawalStatus } from "@/app/withdraw/[txid]/components/util";
import getBitcoinNetwork from "@/util/get-bitcoin-network";

import { hiroClient } from "./hiro-fetch";

import { getEmilyWithdrawal } from "./get-emily-withdrawal";
import { getRegistryWithdrawal } from "./get-registry-withdrawal";

type contractCallData = {
  contract_id: string;
  function_name: string;
  function_signature: string;
  function_args: FunctionArg[];
};

type FunctionArg = {
  hex: string;
  repr: string;
  name: string;
  type: string;
};

export async function getWithdrawalInfo(txidOrRequestId: string): Promise<{
  status: WithdrawalStatus;
  address: string;
  requestId: string | null;
  amount: number;
  stacksTx?: string;
  bitcoinTx?: string;
}> {
  const isRequestId = txidOrRequestId.length < 64;

  if (isRequestId) {
    try {
      return getEmilyWithdrawal(txidOrRequestId);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        "error fetching emily withdrawal falling back to registry",
        // e,
      );
      return getRegistryWithdrawal(txidOrRequestId);
    }
  }

  const tx = await hiroClient.fetch(
    `${hiroClient.baseUrl}/extended/v1/tx/${txidOrRequestId}`,
  );
  const txData = await tx.json();
  const contractCall = txData.contract_call as contractCallData;

  const amount = (Cl.deserialize(contractCall.function_args[0].hex) as UIntCV)
    .value as bigint;

  const recipient = (
    Cl.deserialize(contractCall.function_args[1].hex) as TupleCV<{
      hashbytes: BufferCV;
      version: BufferCV;
    }>
  ).value;

  const address = encodeBitcoinAddress(
    recipient.hashbytes.value,
    recipient.version.value,
    getBitcoinNetwork(env.WALLET_NETWORK),
  );
  let data = {
    address,
    amount: Number(amount),
    requestId: null as string | null,
  };
  let status: WithdrawalStatus = WithdrawalStatus.pending;
  if (txData.tx_status === "success") {
    const [, , printEvent] = txData.events;

    const printEventDeserialized = Cl.deserialize(
      printEvent.contract_log.value.hex,
    ) as TupleCV<{
      "request-id": UIntCV;
    }>;
    const requestId = printEventDeserialized.value["request-id"]
      .value as bigint;

    return await getEmilyWithdrawal(String(requestId));
  } else if (txData.tx_status !== "pending") {
    status = WithdrawalStatus.failed;
  }
  return {
    ...data,
    status,
  };
}
