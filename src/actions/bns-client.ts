"use server";
import {
  ClarityValue,
  fetchCallReadOnlyFunction,
  bufferCVFromString,
  ClarityType,
  cvToString,
} from "@stacks/transactions";

import { env } from "@/env";
import { decodeFQN } from "@/util/bns";

export type NetworkType = "mainnet" | "testnet";

const BNS_CONTRACT_DEPLOYER_MAINNET =
  "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF";
const BNS_CONTRACT_DEPLOYER_TESTNET =
  "ST2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D9SZJQ0M";
const BNS_V2_CONTRACT_NAME = "BNS-V2";

interface BnsReadOnlyOptions {
  functionName: string;
  functionArgs: ClarityValue[];
  senderAddress: string;
  network: NetworkType;
}

export async function bnsNameToAddress(
  fullyQualifiedName: string,
): Promise<string | null> {
  const { namespace, name } = decodeFQN(fullyQualifiedName);
  const network = getNetwork();
  const responseCV = await bnsV2ReadOnlyCall(BNS_V2_CONTRACT_NAME, {
    functionName: "get-owner-name",
    senderAddress: getBnsContractDeployerAddress(network),
    functionArgs: [bufferCVFromString(name), bufferCVFromString(namespace)],
    network,
  });

  if (responseCV.type === ClarityType.ResponseOk) {
    if (responseCV.value.type === ClarityType.OptionalSome) {
      if (
        responseCV.value.value.type === ClarityType.PrincipalStandard ||
        responseCV.value.value.type === ClarityType.PrincipalContract
      ) {
        return cvToString(responseCV.value.value);
      }
      throw new Error("Owner is not a principal");
    }
    if (responseCV.value.type === ClarityType.OptionalNone) {
      return null;
    }
  }
  throw new Error("Invalid response from contract " + BNS_V2_CONTRACT_NAME);
}

async function bnsV2ReadOnlyCall(
  contractName: string,
  options: BnsReadOnlyOptions,
): Promise<ClarityValue> {
  const contractAddress = getBnsContractDeployerAddress(options.network);
  try {
    const response = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: options.functionName,
      functionArgs: options.functionArgs,
      senderAddress: options.senderAddress,
      network: options.network,
    });

    if ((response as any).error) {
      throw new Error((response as any).error);
    }

    return response;
  } catch (error: any) {
    console.error("BNS readonly call failed: ", {
      error: error.message,
      network: options.network,
    });
    throw error;
  }
}

function getNetwork(): NetworkType {
  return env.WALLET_NETWORK !== "mainnet" ? "testnet" : env.WALLET_NETWORK;
}

function getBnsContractDeployerAddress(network: NetworkType): string {
  return network == "mainnet"
    ? BNS_CONTRACT_DEPLOYER_MAINNET
    : BNS_CONTRACT_DEPLOYER_TESTNET;
}
