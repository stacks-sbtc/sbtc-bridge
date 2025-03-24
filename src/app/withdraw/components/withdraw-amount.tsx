import { FlowForm } from "@/comps/core/Form";
import { Heading, SubText } from "@/comps/core/Heading";
import { Schema } from "yup";

export const WithdrawFlowAmount = ({
  validationSchema,
  handleSubmit,
  maxFee,
  disabled,
}: {
  validationSchema: Schema;
  handleSubmit: (value: any) => void;
  maxFee: number;
  disabled?: boolean;
}) => {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between">
        <Heading>Withdraw</Heading>
      </div>
      <SubText>Convert sBTC into BTC</SubText>
      <SubText>
        Note: An additional {Math.ceil(maxFee / 1000)}K sats will be reserved to
        cover Bitcoin transaction fees. Any remaining amount will be
        automatically refunded to your Stacks account as change.{" "}
      </SubText>
      <FlowForm
        disabled={disabled}
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
