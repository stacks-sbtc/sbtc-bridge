"use client";

import { FlowContainer } from "@/comps/core/FlowContainer";
import { Heading, SubText } from "@/comps/core/Heading";

import { useShortAddress } from "@/hooks/use-short-address";
import { bridgeConfigAtom } from "@/util/atoms";
import { useAtomValue } from "jotai";
import { withdrawalStepper, WithdrawalStepper } from "./withdrawal-stepper";
import { WithdrawalStatus } from "./util";
import LandingAnimation from "@/comps/core/LandingAnimation";
import { useQuery } from "@tanstack/react-query";
import { getWithdrawalInfo } from "@/actions/get-withdrawal-data";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const { useStepper, Scoped } = withdrawalStepper;
type Props = {
  btcAmount: number;
  recipient: string;
  txid: string;
  status: WithdrawalStatus;
};
export default function TrackWithdrawalStatus(props: Props) {
  return (
    <LandingAnimation>
      <div className="w-screen flex"></div>
      <Scoped>
        <Content {...props} />
      </Scoped>

      <div
        style={{
          margin: "16px 0",
        }}
      />
    </LandingAnimation>
  );
}

function Content(initialData: Props) {
  const { txid } = initialData;
  const {
    data: { address, amount, status, requestId },
  } = useQuery({
    queryKey: ["withdrawal", txid],
    queryFn: async () => {
      const data = await getWithdrawalInfo(txid);
      return data;
    },
    initialData: {
      status: initialData.status,
      address: initialData.recipient,
      amount: initialData.btcAmount,
      requestId: null,
    },
    refetchInterval: ({ state }) => {
      const status = state.data?.status;
      if (
        status === WithdrawalStatus.failed ||
        status === WithdrawalStatus.confirmed
      ) {
        return false;
      }
      return 5000;
    },
  });

  const router = useRouter();

  useEffect(() => {
    // if the route is request id format do nothing
    if (txid.length < 64) {
      return;
    }

    // if it is a tx id and we have a request id navigate to request id
    if (requestId) {
      router.push(`/withdraw/${requestId}`);
    }
  }, [requestId, router, txid.length]);
  const stepper = useStepper();

  useEffect(() => {
    if (status === WithdrawalStatus.pending) {
      stepper.goTo("stx-tx");
    }
    if (status === WithdrawalStatus.accepted) {
      stepper.goTo("signers-deliberation");
    }
    if (status === WithdrawalStatus.confirmed) {
      stepper.goTo("completed");
    }
  }, [stepper, status]);

  const bridgeConfig = useAtomValue(bridgeConfigAtom);
  return (
    <FlowContainer>
      <div className="w-full flex flex-row items-center justify-between">
        <Heading>Review Transaction</Heading>
      </div>
      <div className="flex flex-col  gap-2">
        <div className="flex flex-col gap-1">
          <SubText>Amount selected to withdraw</SubText>
          <p className="text-black font-Matter font-semibold text-sm">
            {(amount / 1e8).toLocaleString(undefined, {
              maximumFractionDigits: 8,
            })}{" "}
            BTC
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <SubText>Bitcoin address to receive BTC</SubText>
          <p className="text-black font-Matter font-semibold text-sm">
            {useShortAddress(address)}
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-end">
        {status === WithdrawalStatus.failed && (
          <SubText>Withdrawal failed</SubText>
        )}
        {status === WithdrawalStatus.accepted && (
          <SubText>Withdrawal accepted, confirming...</SubText>
        )}
      </div>

      <div className="flex flex-1 items-end">
        <WithdrawalStepper status={status} txId={txid} />
      </div>

      {txid && (
        <div className="w-full flex-row flex justify-between items-center">
          <a
            className="w-40 rounded-lg py-3 flex justify-center items-center flex-row bg-orange"
            href={`https://explorer.hiro.so/txid/${txid}?chain=${
              bridgeConfig.WALLET_NETWORK === "mainnet" ? "mainnet" : "testnet"
            }`}
            target="_blank"
            rel="noreferrer"
          >
            View stacks tx
          </a>
        </div>
      )}
    </FlowContainer>
  );
}
