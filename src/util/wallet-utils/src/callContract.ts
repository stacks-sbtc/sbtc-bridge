import { request } from "sats-connect";

import { StacksNetwork, StacksNetworkName } from "@stacks/network";
import {
  // getFordefiBTCProviderOrThrow,
  getLeatherBTCProviderOrThrow,
} from "./util/btc-provider";

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
  // const btc = getFordefiBTCProviderOrThrow();
  // const response = await btc.request("stx_signTransaction", {
  //   transaction: params.txHex,
  // });
  // if (response.status === "error") {
  //   throw new Error(response.error.message);
  // }
  // return response.result.transaction;
  throw new Error("Not implemented");
};

export const callContractAsigna: CallContract = async (params) => {
  throw new Error("Not implemented");
};
