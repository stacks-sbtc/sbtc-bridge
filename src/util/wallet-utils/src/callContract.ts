import { request } from "sats-connect";

import { StacksNetwork, StacksNetworkName } from "@stacks/network";
import {
  getFordefiBTCProviderOrThrow,
  getLeatherBTCProviderOrThrow,
} from "./util/btc-provider";
import { openContractCall } from "@stacks/connect";
import { AsignaIframeProvider } from "./util/asigna-provider";
import {
  addressToString,
  ContractCallPayload,
  deserializeTransaction,
  wireToPostCondition,
} from "@stacks/transactions";

type RequestArgs = {
  txHex: string;
  network?: StacksNetworkName | StacksNetwork;
};

type CallContract = (params: RequestArgs) => Promise<string>;

export const callContractXverse: CallContract = async (params) => {
  const response = await request("stx_signTransaction", {
    transaction: params.txHex,
  });
  if (response.status === "error") {
    throw new Error(response.error.message);
  }
  return response.result.transaction;
};

export const callContractLeather: CallContract = async (params) => {
  const btc = getLeatherBTCProviderOrThrow();
  const response = await btc.request("stx_signTransaction", {
    txHex: params.txHex,
    network: params.network,
  });

  const txHex = response.result.txHex;

  return txHex;
};

export const callContractFordefi: CallContract = async (params) => {
  const btc = getFordefiBTCProviderOrThrow();
  const response = await btc.request("stx_signTransaction", {
    transaction: params.txHex,
  });
  if (response.status === "error") {
    throw new Error(response.error.message);
  }
  return response.result.transaction;
};

export const callContractAsigna: CallContract = async (params) => {
  const tx = deserializeTransaction(params.txHex);
  const payload = tx.payload as ContractCallPayload;

  return new Promise<string>((resolve, reject) =>
    openContractCall(
      {
        contractName: payload.contractName.content,
        contractAddress: addressToString(payload.contractAddress),
        functionArgs: payload.functionArgs,
        functionName: payload.functionName.content,
        postConditionMode: tx.postConditionMode,
        postConditions: tx.postConditions.values.map(wireToPostCondition),
        anchorMode: tx.anchorMode,
        fee: Number(tx.auth.spendingCondition.fee),
        network: params.network,
        onFinish: (data) => resolve(data.txId),
        onCancel: reject,
      },
      AsignaIframeProvider as any,
    ),
  );
};
