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
import { getExplorerUrl } from "@/lib/get-explorer-url";
import { getStacksNetwork } from "@/util/get-stacks-network";
import { queryClient } from "@/query/client";

const { useStepper, Scoped } = withdrawalStepper;
type Props = {
  txid: string;
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
    data: { address, amount, requestId, status, bitcoinTx },
    isFetched,
  } = useQuery({
    queryKey: ["withdrawal", txid],
    queryFn: async () => {
      const data = await getWithdrawalInfo(requestId || txid);
      return data;
    },
    initialData: {
      status: WithdrawalStatus.pending,
      address: "",
      amount: 0,
      stacksTx: "",
      bitcoinTx: "",
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

  useEffect(() => {
    if (status === WithdrawalStatus.confirmed) {
      queryClient.invalidateQueries({ queryKey: ["sbtc-balance"] });
    }
  }, [status]);

  const shortAddress = useShortAddress(address);

  const bridgeConfig = useAtomValue(bridgeConfigAtom);
  return (
    isFetched && (
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
              {shortAddress}
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

        <div className="w-full flex-row flex justify-between items-center">
          <a
            className="w-40 rounded-lg py-3 flex justify-center items-center flex-row bg-orange"
            href={getExplorerUrl(
              txid,
              getStacksNetwork(bridgeConfig.WALLET_NETWORK),
            )}
            target="_blank"
            rel="noreferrer"
          >
            View stacks tx
          </a>

          {bitcoinTx && (
            <a
              className="w-40 rounded-lg py-3 flex justify-center items-center flex-row bg-orange"
              href={`${bridgeConfig.PUBLIC_MEMPOOL_URL}/tx/${bitcoinTx}`}
              target="_blank"
              rel="noreferrer"
            >
              View bitcoin tx
            </a>
          )}
        </div>
      </FlowContainer>
    )
  );
}
