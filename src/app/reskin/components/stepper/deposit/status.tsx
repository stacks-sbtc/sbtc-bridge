import { LoadingIndicator } from "../../../assets/loading-indicator";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Stepper } from "@stepperize/react";
import { useParams } from "next/navigation";
import { useReskinDepositStatus } from "@/app/reskin/hooks/use-reskin-deposit-status";
import { DepositStatus } from "@/hooks/use-deposit-status";
import { useAtomValue } from "jotai";
import { bridgeConfigAtom } from "@/util/atoms";
import { getExplorerUrl } from "@/lib/get-explorer-url";
import { getStacksNetwork } from "@/util/get-stacks-network";
import { EmilyTxConfirmed } from "@/util/tx-utils";

export function HyperLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className="text-orange dark:text-dark-reskin-orange hover:underline"
    >
      {children}
    </a>
  );
}

export function TxPendingStatus({ bitcoinTxId }: { bitcoinTxId: string }) {
  const { PUBLIC_MEMPOOL_URL } = useAtomValue(bridgeConfigAtom);
  return (
    <div className="flex flex-col items-center justify-center mt-4 h-28">
      <LoadingIndicator />
      <div className="h-8 flex items-center text-xl leading-normal tracking-[-0.02em] text-center text-reskin-dark-gray dark:text-midGray uppercase mt-2 font-matter-mono">
        Processing
      </div>
      <div>
        ( Estimation{" "}
        <HyperLink href={`${PUBLIC_MEMPOOL_URL}/tx/${bitcoinTxId}`}>
          5min
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
  bitcoinTxId: string;
  stacksTxId?: string;
}) {
  const { PUBLIC_MEMPOOL_URL, WALLET_NETWORK } = useAtomValue(bridgeConfigAtom);

  return (
    <div className="flex flex-col items-center justify-center mt-4 h-28">
      <CheckCircleIcon className="h-8 w-8 text-green-500 dark:text-green-700" />
      <div className="h-8 flex items-center text-xl leading-normal tracking-[-0.02em] text-center text-reskin-dark-gray dark:text-midGray uppercase mt-2 font-matter-mono">
        Completed
      </div>
      <div>
        <HyperLink href={`${PUBLIC_MEMPOOL_URL}/tx/${bitcoinTxId}`}>
          mempool tx
        </HyperLink>
      </div>
      {stacksTxId && (
        <div>
          <HyperLink
            href={getExplorerUrl(stacksTxId, getStacksNetwork(WALLET_NETWORK))}
          >
            stacks tx
          </HyperLink>
        </div>
      )}
    </div>
  );
}

export function TxFailedStatus({ bitcoinTxId }: { bitcoinTxId: string }) {
  const { PUBLIC_MEMPOOL_URL } = useAtomValue(bridgeConfigAtom);
  return (
    <div className="flex flex-col items-center justify-center mt-4 h-28">
      <XCircleIcon className="h-8 w-8 text-red-500 dark:text-red-700" />
      <div className="h-8 flex items-center text-xl leading-normal tracking-[-0.02em] text-center text-reskin-dark-gray dark:text-midGray uppercase mt-2 font-matter-mono">
        Failed
      </div>
      <div>
        <HyperLink href={`${PUBLIC_MEMPOOL_URL}/tx/${bitcoinTxId}`}>
          mempool tx
        </HyperLink>
      </div>
    </div>
  );
}

export function StatusDescription({ stepper }: { stepper: Stepper }) {
  const { slug } = useParams<{ slug?: string }>();
  const { status, emilyDepositInfo } = useReskinDepositStatus(slug);
  const isCurrentStep = stepper.current.id === "status";

  return !isCurrentStep ? (
    <span className="opacity-60">
      We will confirm the transaction status once the transaction is confirmed.
    </span>
  ) : (
    <>
      {status === DepositStatus.Completed && (
        <TxCompleteStatus
          bitcoinTxId={slug!}
          stacksTxId={
            // THIS WILL BE FOR SURE the confirmed type
            (emilyDepositInfo as EmilyTxConfirmed).fulfillment.StacksTxid
          }
        />
      )}
      {status === DepositStatus.Failed && (
        <TxFailedStatus bitcoinTxId={slug!} />
      )}
      {(status === DepositStatus.PendingConfirmation ||
        status === DepositStatus.PendingMint) && (
        <TxPendingStatus bitcoinTxId={slug!} />
      )}
    </>
  );
}
