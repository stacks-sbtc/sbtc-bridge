import { AddressPurpose, request, RpcSuccessResponse } from "sats-connect";
import { DefaultNetworkConfigurations } from "@leather.io/models";

import {
  authenticate,
  AppConfig,
  UserSession,
  FinishedAuthData,
} from "@stacks/connect";
import { Address, BtcAddress } from "@leather.io/rpc";
import {
  FORDEFI_PROVIDER_ID,
  getLeatherBTCProviderOrThrow,
} from "./util/btc-provider";
import { AsignaIframeProvider } from "./util/asigna-provider";

type Results = {
  /** @description payment address can be native segwit or segwit */
  payment: {
    address: string;
    publicKey: string;
  } | null;
  /** @description stacks address */
  stacks: {
    address: string;
    publicKey: string;
  } | null;
  musig: {
    users: AsignaUser[];
    threshold: number;
  } | null;
};

export type AsignaUser = {
  _id: string;
  address: string;
  __v: number;
  publicKey: string;
  walletClass: string;
  walletType: string;
};

export type getAddresses = (params?: {
  message?: string;
  network?: DefaultNetworkConfigurations;
  action?: () => Promise<any>;
}) => Promise<Results>;

const getAddressByPurpose = (
  response: RpcSuccessResponse<"wallet_connect">["result"],
  purpose: AddressPurpose,
) => response.addresses.find((item) => item.purpose === purpose);

export function getWalletAddresses(
  response: RpcSuccessResponse<"wallet_connect">["result"],
) {
  const payment = getAddressByPurpose(response, AddressPurpose.Payment);
  const stacks = getAddressByPurpose(response, AddressPurpose.Stacks);
  return {
    payment: payment || null,
    stacks: stacks || null,
    musig: null,
  };
}

/**
 * @name getAddressXverse
 * @description Get the address for the user
 */
export const getAddressesXverse: getAddresses = async (params) => {
  const response = await request("wallet_connect", {
    addresses: [
      AddressPurpose.Ordinals,
      AddressPurpose.Payment,
      AddressPurpose.Stacks,
    ],
  });

  if (response.status === "error") {
    throw new Error(response.error.message);
  }

  const result = response.result;
  return getWalletAddresses(result);
};

export const getAddressesFordefi: getAddresses = async (params) => {
  const response = await request(
    "wallet_connect",
    {
      addresses: [
        AddressPurpose.Ordinals,
        AddressPurpose.Payment,
        AddressPurpose.Stacks,
      ],
    },
    FORDEFI_PROVIDER_ID,
  );

  if (response.status === "error") {
    throw new Error(response.error.message);
  }

  const result = response.result;
  return getWalletAddresses(result);
};

export const getAddressesAsigna: getAddresses = async (params) => {
  return Promise.any([getBTCAddressAsigna(params), getStxAddressAsigna()]);
};

const getBTCAddressAsigna: getAddresses = async (params) => {
  if (!params?.action) {
    throw new Error("Action is required");
  }
  const response = await params.action();

  return {
    payment: {
      address: response.address,
      publicKey: response.publicKey,
    },
    stacks: null,
    musig: {
      users: response.users,
      threshold: response.threshold,
    },
  };
};

const getStxAddressAsigna: getAddresses = async () => {
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });
  const result = await new Promise<FinishedAuthData>((res, rej) => {
    authenticate(
      {
        userSession,
        appDetails: {
          name: "sBTC Bridge",
          icon: window.location.origin + "/icon.png",
        },
        onFinish: res,
        onCancel: rej,
      },
      AsignaIframeProvider as any,
    );
  });
  const stxAddress = result.userSession.loadUserData().profile.stxAddress
    .mainnet as string;
  return {
    payment: null,
    musig: null,
    stacks: {
      address: stxAddress,
      publicKey: "",
    },
  };
};

const extractAddressByType = (
  addresses: Address[],
  addressType: BtcAddress["type"],
) => {
  const addressInfo = addresses.find(
    (address) => address.symbol === "BTC" && address.type === addressType,
  );

  return addressInfo || null;
};
/**
 * @name getAddressesLeather
 * @description Get addresses for leather wallet
 */
export const getAddressesLeather: getAddresses = async () => {
  const btc = getLeatherBTCProviderOrThrow();
  const response = await btc.request("getAddresses");

  const { addresses } = response.result;
  const payment = extractAddressByType(addresses, "p2wpkh");
  const stacks = addresses.find((address) => address.symbol === "STX");

  return {
    payment: payment || null,
    stacks: stacks || null,
    musig: null,
  };
};
