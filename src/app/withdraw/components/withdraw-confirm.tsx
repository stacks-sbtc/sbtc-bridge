import { SecondaryButton, PrimaryButton } from "@/comps/core/FlowButtons";
import { Heading, SubText } from "@/comps/core/Heading";
import { useShortAddress } from "@/hooks/use-short-address";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Stepper } from "@stepperize/react";

export const WithdrawConfirm = ({
  amount,
  btcAddress,
  stepper,
  handleSubmit,
}: {
  amount: number;
  btcAddress: string;
  stepper: Stepper;
  handleSubmit: () => void;
}) => {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between">
        <Heading>Withdraw</Heading>
      </div>
      <div className="flex flex-col  gap-2">
        <div className="flex flex-col gap-1">
          <SubText>Amount selected to Withdraw</SubText>
          <p className="text-black font-Matter font-semibold text-sm">
            {amount} sBTC
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <SubText>Bitcoin address to withdraw to</SubText>
          <p className="text-black font-Matter font-semibold text-sm">
            {useShortAddress(btcAddress)}
          </p>
        </div>
      </div>
      <div className="flex flex-1 ">
        <div className="w-full p-4 bg-lightOrange h-10 rounded-lg flex flex-row items-center justify-center gap-2">
          <InformationCircleIcon className="h-6 w-6 text-orange" />
          <p className="text-orange font-Matter font-semibold text-sm break-keep">
            Please verify the information before proceeding
          </p>
        </div>
      </div>
      <div className="w-full flex-row flex justify-between items-center">
        <SecondaryButton onClick={() => stepper.prev()}>PREV</SecondaryButton>
        <PrimaryButton onClick={handleSubmit}>NEXT</PrimaryButton>
      </div>
    </>
  );
};
