import { Field } from "formik";
import { InputContainer } from "../form-elements/input-container";

import { Textarea } from "@/components/ui/textarea";

export const AmountInput = ({
  isReadonly,
  onClickEdit,
  value,
  error,
}: {
  isReadonly: boolean;
  onClickEdit: () => void;
  value: string;
  error?: string | boolean;
}) => {
  return (
    <InputContainer
      isReadonly={isReadonly}
      onClickEdit={onClickEdit}
      title="Selected Deposit Amount"
      value={value}
    >
      <div className="text-black h-48 rounded-2xl bg-transparent border border-black border-opacity-20 dark:border-opacity-20 dark:border-white p-3">
        <div className=" bg-input-label-dark text-white flex items-center justify-center rounded-full w-28 h-10">
          BTC
        </div>
        <Field
          component={Textarea}
          className="text-black dark:text-white h-full w-full bg-transparent break-all text-3xl"
          name="amount"
          placeholder="Amount"
        />
      </div>
      {error ? <div>{error}</div> : null}
    </InputContainer>
  );
};
