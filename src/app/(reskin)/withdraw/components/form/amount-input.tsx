import { Field, FieldProps } from "formik";

import { Textarea } from "@/components/ui/textarea";
import { InputContainer } from "@/app/(reskin)/components/forms/form-elements/input-container";

export const AmountInput = ({
  isReadonly,
  onClickEdit,
  value,
  error,
  onPressEnter,
  isEditable,
  isDisabled,
}: {
  isReadonly: boolean;
  onClickEdit?: () => void;
  value: string;
  error?: string | boolean;
  onPressEnter?: () => void;
  isEditable?: boolean;
  isDisabled?: boolean;
}) => {
  return (
    <InputContainer
      isReadonly={isReadonly}
      isEditable={isEditable}
      onClickEdit={onClickEdit}
      title="Selected Withdrawal Amount"
      readonlyValue={value}
    >
      <div
        className={`md:ml-14 min-h-48 rounded-2xl bg-transparent border pt-6 pb-3 pr-3 pl-8 ${error ? "border-red-500" : "border-black dark:border-white border-opacity-20 dark:border-opacity-20"}`}
      >
        <div className="uppercase text-xl tracking-normal text-gray-500 dark:text-gray-400 mb-2">
          Withdraw sBTC
        </div>
        <Field name="amount" placeholder="Amount">
          {({ field, meta }: FieldProps) => {
            return (
              <>
                <Textarea
                  disabled={isDisabled}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      onPressEnter?.();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  autoFocus
                  className="!text-black dark:!text-white w-full bg-transparent break-all text-5xl tracking-tight h-8 text-center"
                  {...field}
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
