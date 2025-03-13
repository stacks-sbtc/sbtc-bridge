import { FlowForm } from "@/comps/core/Form";
import { Heading, SubText } from "@/comps/core/Heading";
import { Stepper } from "@stepperize/react";
import { Schema } from "yup";

export const WithdrawFlowAmount = ({
  validationSchema,
  handleSubmit,
  stepper,
}: {
  validationSchema: Schema;
  handleSubmit: (value: any) => void;
  stepper: Stepper;
}) => {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between">
        <Heading>Withdraw</Heading>
      </div>
      <SubText>Convert sBTC into BTC</SubText>
      <FlowForm
        nameKey="amount"
        requiredConnection="stx"
        initialValue={""}
        validationSchema={validationSchema}
        type="text"
        placeholder="Enter sBTC amount to withdraw"
        handleSubmit={handleSubmit}
      />
    </>
  );
};
