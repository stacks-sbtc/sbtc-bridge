"use client";

import { useMemo } from "react";
import { DefaultNetworkConfigurations } from "@leather.io/models";
import { useRouter } from "next/navigation";

import { useAtomValue } from "jotai";
import { bridgeConfigAtom, walletInfoAtom, WalletProvider } from "@/util/atoms";
import {
  Cl,
  makeUnsignedContractCall,
  Pc,
  serializeTransaction,
} from "@stacks/transactions";
import { serverBroadcastTx } from "@/actions/server-broadcast-tx";
import {
  callContractFordefi,
  callContractLeather,
  callContractXverse,
} from "@/util/wallet-utils";
import { getStacksNetwork } from "@/util/get-stacks-network";

import { decodeBitcoinAddress } from "@/util/decode-bitcoin-address";
import { validateBitcoinAddress } from "@/util/validate-bitcoin-address";
import { defineStepper, Stepper } from "@stepperize/react";
import * as yup from "yup";

import { FlowContainer } from "@/comps/core/FlowContainer";
import LandingAnimation from "@/comps/core/LandingAnimation";

import { WithdrawFlowAddress } from "./withdraw-address";
import { testBTCAddress } from "@/util/yup/test-btc-address";
import { WithdrawFlowAmount } from "./withdraw-amount";
import { useFormik } from "formik";
import { WithdrawConfirm } from "./withdraw-confirm";
import { useSBTCBalance } from "@/hooks/use-sbtc-balance";
import { useQuery } from "@tanstack/react-query";
import { getWithdrawalMaxFee } from "@/actions/get-withdrawal-max-fee";
import { useEmilyLimits } from "@/hooks/use-mint-caps";
import { useAsignaConnect } from "@asigna/stx-connect";
import { StacksNetwork, StacksNetworkName } from "@stacks/network";

import {
  createFungiblePostCondition,
  createAssetInfo,
  AnchorMode,
  Cl as Cl6,
  FungibleConditionCode,
} from "@stacks/transactions-v6";

const decodeBitcoinAddressToClarityRecipient = (
  address: string,
  network: DefaultNetworkConfigurations,
) => {
  if (validateBitcoinAddress(address, network)) {
    return decodeBitcoinAddress(address);
  } else {
    throw new Error(`Invalid address: ${address}`);
  }
};

const { useStepper } = defineStepper(
  {
    id: "amount",
    type: "number",
    initValue: "",
    placeholder: "withdraw amount",
  },
  {
    id: "address",
    type: "text",
    initValue: "",
    placeholder: "address to receive your Bitcoin",
  },
  {
    id: "confirm",
  },
  {
    id: "status",
  },
);

const Withdraw = () => {
  const { addresses, selectedWallet } = useAtomValue(walletInfoAtom);
  const { data: satsBalance } = useSBTCBalance({
    address: addresses.stacks?.address,
  });

  const {
    data: maxFee,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["maxFee"],
    queryFn: async () => {
      return getWithdrawalMaxFee();
    },
  });

  const {
    data: emilyLimits,
    refetch,
    isLoading: emilyLimitsLoading,
  } = useEmilyLimits();

  const maxWithdrawal = (emilyLimits?.perWithdrawalCap || 0) / 1e8;
  const getMaxError = (maxWithdrawal: number) => {
    return `Withdrawal exceeds current cap of ${maxWithdrawal.toLocaleString(undefined, { maximumFractionDigits: 8 })} BTC`;
  };
  const config = useAtomValue(bridgeConfigAtom);
  const amountValidationSchema = useMemo(() => {
    const btcBalance = Number(satsBalance) / 1e8;
    const fee = maxFee! / 1e8;
    return yup.object().shape({
      amount: yup
        .number()
        .min(config.WITHDRAW_MIN_AMOUNT_SATS)
        .max(
          btcBalance - fee,
          `The withdrawal + max fees (${fee.toLocaleString(undefined, { maximumFractionDigits: 8 })}) amount exceeds your current balance of ${btcBalance.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 8,
            },
          )} sBTC`,
        )
        .max(maxWithdrawal, getMaxError(maxWithdrawal))
        .required(),
    });
  }, [satsBalance, maxFee, maxWithdrawal, config.WITHDRAW_MIN_AMOUNT_SATS]);
  const { WALLET_NETWORK: stacksNetwork } = useAtomValue(bridgeConfigAtom);
  const addressValidationSchema = useMemo(
    () =>
      yup.object().shape({
        address: yup
          .string()
          .test("btc", "Invalid BTC address", function (value) {
            return testBTCAddress.call(this, value, stacksNetwork!);
          })
          .required(),
      }),
    [stacksNetwork],
  );
  const router = useRouter();

  const { WALLET_NETWORK, SBTC_CONTRACT_DEPLOYER } =
    useAtomValue(bridgeConfigAtom);
  const { openAsignaContractCall } = useAsignaConnect();
  const handleSubmit = async (values: Record<string, string>) => {
    const { address, amount } = values;

    if (!WALLET_NETWORK) {
      throw new Error("Invalid network");
    }
    if (!SBTC_CONTRACT_DEPLOYER) {
      throw new Error("Invalid contract deployer");
    }
    // get the proper data for the address
    const recipient = decodeBitcoinAddressToClarityRecipient(
      address,
      WALLET_NETWORK,
    );
    let publicKey = addresses.stacks?.publicKey;

    if (!publicKey) {
      if (selectedWallet === WalletProvider.ASIGNA) {
        // asigna only provides the stacks address
        // this workaround works so why not
        publicKey = "";
      } else {
        throw new Error("Invalid public key");
      }
    }

    // convert the amount to satoshis
    const satoshiAmount = Math.round(parseFloat(amount) * 1e8);

    // convert the fee to satoshis
    const satoshiFee = Math.round(maxFee!);

    const contractArgs = [
      Cl.uint(satoshiAmount),
      Cl.tuple({
        version: Cl.bufferFromHex(recipient.type),
        hashbytes: Cl.buffer(recipient.hash),
      }),
      Cl.uint(satoshiFee),
    ];

    const stacksNetwork = getStacksNetwork(WALLET_NETWORK);

    const opts = {
      contractAddress: SBTC_CONTRACT_DEPLOYER,
      contractName: "sbtc-withdrawal",
      functionName: "initiate-withdrawal-request",
      functionArgs: contractArgs,
      publicKey,
      network: stacksNetwork,

      postConditions: [
        Pc.principal(addresses.stacks!.address)
          .willSendLte(satoshiAmount + satoshiFee)
          .ft(`${SBTC_CONTRACT_DEPLOYER}.sbtc-token`, "sbtc-token"),
      ],
    } as any;

    if (WALLET_NETWORK !== "mainnet") {
      // fee apis break in devenv and testnet sometimes and are unreliable
      opts.fee = 10_000;
    }
    const transaction = await makeUnsignedContractCall(opts);

    const signTx = {
      [WalletProvider.XVERSE]: callContractXverse,
      [WalletProvider.LEATHER]: callContractLeather,
      [WalletProvider.FORDEFI]: callContractFordefi,
      [WalletProvider.ASIGNA]: async ({}: {
        txHex: string;
        network: StacksNetworkName | StacksNetwork;
      }) => {
        const txid = await openAsignaContractCall(
          {
            contractName: opts.contractName!,
            contractAddress: opts.contractAddress!,
            functionName: opts.functionName!,
            functionArgs: [
              Cl6.uint(satoshiAmount),
              Cl6.tuple({
                version: Cl6.bufferFromHex(recipient.type),
                hashbytes: Cl6.buffer(recipient.hash),
              }),
              Cl6.uint(satoshiFee),
            ],
            anchorMode: AnchorMode.Any,
            postConditions: [
              createFungiblePostCondition(
                addresses.stacks!.address!,
                FungibleConditionCode.LessEqual,
                satoshiAmount + satoshiFee,
                createAssetInfo(
                  SBTC_CONTRACT_DEPLOYER,
                  "sbtc-token",
                  "sbtc-token",
                ),
              ),
            ],
          },
          {
            execute: true,
          },
        );

        return txid!;
      },
    }[selectedWallet!];

    const signedTx = await signTx({
      txHex: serializeTransaction(transaction),
      network: stacksNetwork,
    });
    let txId = signedTx;
    if (selectedWallet !== WalletProvider.ASIGNA) {
      const broadcastResponse = await serverBroadcastTx({
        txHex: signedTx,
      });
      txId = broadcastResponse.txid;
    }
    router.push(`/withdraw/${txId}`);
    // add tx to search query for the user to have a link to the tx
  };
  const stepper = useStepper();
  const {
    setFieldValue,
    values,
    handleSubmit: submitForm,
  } = useFormik({
    initialValues: {
      amount: "",
      address: "",
    },
    onSubmit: handleSubmit,
  });

  return (
    <FlowContainer>
      {stepper.switch({
        amount: () => (
          <WithdrawFlowAmount
            isFailed={isError}
            isLoading={isLoading}
            maxFee={maxFee}
            validationSchema={amountValidationSchema}
            handleSubmit={async (value) => {
              const limits = await refetch();

              const maxWithdrawalCap =
                (limits.data?.perWithdrawalCap || 0) / 1e8;

              if (value > maxWithdrawalCap) {
                return getMaxError(maxWithdrawalCap);
              }
              setFieldValue("amount", value);
              stepper.next();
            }}
            disabled={maxFee === undefined || emilyLimitsLoading}
          />
        ),
        address: () => (
          <WithdrawFlowAddress
            validationSchema={addressValidationSchema as any}
            handleSubmit={(value) => {
              setFieldValue("address", value);
              stepper.next();
            }}
            stepper={stepper as Stepper<any>}
          />
        ),
        confirm: () => (
          <WithdrawConfirm
            amount={Number(values.amount)}
            btcAddress={values.address}
            stepper={stepper as Stepper<any>}
            handleSubmit={() => {
              submitForm();
            }}
          />
        ),
      })}
    </FlowContainer>
  );
};

export const WithdrawClient = () => {
  return (
    <LandingAnimation>
      <div className="w-screen flex"></div>
      <Withdraw />
      <div
        style={{
          margin: "16px 0",
        }}
      />
    </LandingAnimation>
  );
};
