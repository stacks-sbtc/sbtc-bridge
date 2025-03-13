import { SecondaryButton } from "@/comps/core/FlowButtons";
import { FlowForm } from "@/comps/core/Form";
import { Heading, SubText } from "@/comps/core/Heading";
import { walletInfoAtom } from "@/util/atoms";
import { Stepper } from "@stepperize/react";
import { useAtomValue } from "jotai";
import { Schema } from "yup";

export const WithdrawFlowAddress = ({
  validationSchema,
  handleSubmit,
  stepper,
}: {
  validationSchema: Schema;
  handleSubmit: (value: any) => void;
  stepper: Stepper;
}) => {
  const {
    addresses: { payment },
  } = useAtomValue(walletInfoAtom);

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between">
        <Heading>Withdraw</Heading>
      </div>
      <SubText>Address selected to withdraw</SubText>
      <FlowForm
        nameKey="address"
        requiredConnection="stx"
        initialValue={payment?.address}
        validationSchema={validationSchema}
        type="text"
        placeholder="Enter BTC address to transfer to"
        handleSubmit={handleSubmit}
      >
        <SecondaryButton onClick={() => stepper.prev()} isValid={true}>
          PREV
        </SecondaryButton>
      </FlowForm>
    </>
  );
};
