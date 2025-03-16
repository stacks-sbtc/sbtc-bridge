import { Field, FieldProps } from "formik";
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
      <div
        className={`text-black min-h-48 rounded-2xl bg-transparent border p-3 ${error ? "border-red-500" : "border-black dark:border-white border-opacity-20 dark:border-opacity-20"}`}
      >
        <div className="bg-gray dark:bg-input-label-dark dark:text-white flex items-center justify-center rounded-full w-28 h-10">
          BTC
        </div>
        <Field name="amount" placeholder="Amount">
          {({ field, form, meta }: FieldProps) => {
            return (
              <>
                <Textarea
                  className="text-black dark:text-white w-full bg-transparent break-all text-5xl tracking-tight h-8 placeholder:text-xl placeholder:tracking-normal text-center placeholder:text-left"
                  {...field}
                  placeholder="Enter BTC amount to deposit"
                />
                {meta.touched && meta.error ? (
                  <div className="text-red-500">{meta.error}</div>
                ) : null}
              </>
            );
          }}
        </Field>
      </div>
    </InputContainer>
  );
};
