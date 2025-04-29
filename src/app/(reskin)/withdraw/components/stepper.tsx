import { WithdrawalStatus } from "@/app/_withdraw/[txid]/components/util";
import { defineStepper, Stepper } from "@stepperize/react";
import { useParams } from "next/navigation";
import { useWithdrawalInfo } from "../hooks/use-withdrawal-info";
import { useAtomValue } from "jotai";
import { bridgeConfigAtom } from "@/util/atoms";
import { HyperLink } from "../../components/stepper/deposit/status";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { LoadingIndicator } from "../../assets/loading-indicator";
import { getExplorerUrl } from "@/lib/get-explorer-url";
import { getStacksNetwork } from "@/util/get-stacks-network";

function SubmitWithdraw({}) {
  return (
    <span className="md:opacity-60 px-4 md:px-0">
      How much sBTC are you transferring back to BTC? Enter an amount that’s
      above the dust requirement (546 sats)
    </span>
  );
}

function AddressDescription({}) {
  return (
    <span className="md:opacity-60 px-4 md:px-0">
      BTC will be sent to a Bitcoin address. Connecting a wallet will auto-fill
      this in, but feel free to submit another address.
    </span>
  );
}

export function TxPendingStatus({
  stacksTxId,
  bitcoinTxId,
}: {
  stacksTxId: string;
  bitcoinTxId?: string;
}) {
  const { WALLET_NETWORK, PUBLIC_MEMPOOL_URL } = useAtomValue(bridgeConfigAtom);
  return (
    <div className="flex flex-col items-center justify-center mt-4 h-28">
      <LoadingIndicator />
      <div className="h-8 flex items-center text-xl leading-normal tracking-[-0.02em] text-center text-reskin-dark-gray dark:text-midGray uppercase mt-2 font-matter-mono">
        Processing
      </div>
      <div>
        ( Estimation{" "}
        <HyperLink
          href={
            bitcoinTxId
              ? `${PUBLIC_MEMPOOL_URL}/tx/${bitcoinTxId}`
              : getExplorerUrl(stacksTxId, getStacksNetwork(WALLET_NETWORK))
          }
        >
          1 hour
        </HyperLink>{" "}
        )
      </div>
    </div>
  );
}

export function TxCompleteStatus({
  bitcoinTxId,
  stacksTxId,
}: {
  bitcoinTxId?: string;
  stacksTxId: string;
}) {
  const { PUBLIC_MEMPOOL_URL, WALLET_NETWORK } = useAtomValue(bridgeConfigAtom);

  return (
    <div className="flex flex-col items-center justify-center mt-4 h-28">
      <CheckCircleIcon className="h-8 w-8 text-green-500 dark:text-green-700" />
      <div className="h-8 flex items-center text-xl leading-normal tracking-[-0.02em] text-center text-reskin-dark-gray dark:text-midGray uppercase mt-2 font-matter-mono">
        Completed
      </div>
      {bitcoinTxId && (
        <div>
          <HyperLink href={`${PUBLIC_MEMPOOL_URL}/tx/${bitcoinTxId}`}>
            mempool tx
          </HyperLink>
        </div>
      )}
      <div>
        <HyperLink
          href={getExplorerUrl(stacksTxId, getStacksNetwork(WALLET_NETWORK))}
        >
          stacks tx
        </HyperLink>
      </div>
    </div>
  );
}

export function TxFailedStatus({ stacksTxId }: { stacksTxId: string }) {
  const { WALLET_NETWORK } = useAtomValue(bridgeConfigAtom);
  return (
    <div className="flex flex-col items-center justify-center mt-4 h-28">
      <XCircleIcon className="h-8 w-8 text-red-500 dark:text-red-700" />
      <div className="h-8 flex items-center text-xl leading-normal tracking-[-0.02em] text-center text-reskin-dark-gray dark:text-midGray uppercase mt-2 font-matter-mono">
        Failed
      </div>
      <div>
        <HyperLink
          href={getExplorerUrl(stacksTxId, getStacksNetwork(WALLET_NETWORK))}
        >
          stacks tx
        </HyperLink>
      </div>
    </div>
  );
}

function StatusDescription({ stepper }: { stepper: Stepper }) {
  const { slug: withdrawTxId } = useParams<{ slug: string }>();
  const isCurrentStep = stepper.current.id === "status";

  const {
    data: { status, bitcoinTx },
  } = useWithdrawalInfo({ txid: withdrawTxId });

  const isFinal =
    status === WithdrawalStatus.confirmed || status === WithdrawalStatus.failed;

  return !isCurrentStep ? (
    <span className="opacity-60">
      We will confirm the transaction status once the transaction is confirmed.
    </span>
  ) : (
    <>
      {status === WithdrawalStatus.confirmed && (
        <TxCompleteStatus bitcoinTxId={bitcoinTx} stacksTxId={withdrawTxId!} />
      )}
      {status === WithdrawalStatus.failed && (
        <TxFailedStatus stacksTxId={withdrawTxId!} />
      )}
      {!isFinal && <TxPendingStatus stacksTxId={withdrawTxId!} />}
    </>
  );
}

export const withdrawStepper = defineStepper(
  {
    id: "amount",
    title: "Select Withdrawal Amount",
    description: SubmitWithdraw,
  },
  {
    id: "address",
    title: "Provide a Withdrawal Address",
    description: AddressDescription,
  },
  {
    id: "confirm",
    title: "Confirm Withdrawal",
    description: () => (
      <span className="md:opacity-60 px-4 md:px-0">
        Confirm your withdrawal details and proceed.
      </span>
    ),
  },
  {
    id: "status",
    title: "Operation Status",
    description: () => {
      const stepper = withdrawStepper.useStepper();
      return <StatusDescription stepper={stepper as any} />;
    },
  },
);
