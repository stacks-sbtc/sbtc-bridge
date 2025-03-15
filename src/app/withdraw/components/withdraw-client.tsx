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
  callContractAsigna,
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
import { MAX_WITHDRAWAL_FEE } from "@/util/constants";

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

  const amountValidationSchema = useMemo(() => {
    const btcBalance = Number(satsBalance) / 1e8;
    return yup.object().shape({
      amount: yup
        .number()
        .min(0)
        .max(
          btcBalance - MAX_WITHDRAWAL_FEE / 1e8,
          `The withdrawal + max fees amount exceeds your current balance of ${btcBalance.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 8,
            },
          )} sBTC`,
        )
        .required(),
    });
  }, [satsBalance]);
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
    const publicKey = addresses.stacks?.publicKey;

    if (!publicKey) {
      throw new Error("Invalid public key");
    }

    // convert the amount to satoshis
    const satoshiAmount = Math.round(parseFloat(amount) * 1e8);

    // convert the fee to satoshis
    const satoshiFee = Math.round(MAX_WITHDRAWAL_FEE);

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
      [WalletProvider.ASIGNA]: callContractAsigna,
    }[selectedWallet!];

    const signedTx = await signTx({
      txHex: serializeTransaction(transaction),
      network: stacksNetwork,
    });

    const broadcastResponse = await serverBroadcastTx({
      txHex: signedTx,
    });
    const txId = broadcastResponse.txid;
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
            validationSchema={amountValidationSchema as any}
            handleSubmit={(value) => {
              setFieldValue("amount", value);
              stepper.next();
            }}
            stepper={stepper as Stepper<any>}
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
