import { Field, FieldProps } from "formik";
import { ChangeEvent } from "react";

import { Textarea } from "@/components/ui/textarea";
import { sanitizeAmountInput } from "../utils/sanitize-amount";
import { InputContainer } from "../form-elements/input-container";

export const AmountInput = ({
  isReadonly,
  onClickEdit,
  value,
  error,
  onPressEnter,
  isEditable,
  balance,
}: {
  isReadonly: boolean;
  onClickEdit?: () => void;
  value: string;
  error?: string | boolean;
  onPressEnter?: () => void;
  isEditable?: boolean;
  balance?: number;
}) => {
  return (
    <InputContainer
      isReadonly={isReadonly}
      isEditable={isEditable}
      onClickEdit={onClickEdit}
      title="Selected Deposit Amount"
      readonlyValue={value}
    >
      <div
        className={`md:ml-14 min-h-48 rounded-2xl bg-transparent border pt-6 pb-3 pr-3 pl-8 ${error ? "border-red-500" : "border-black dark:border-white border-opacity-20 dark:border-opacity-20"}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="uppercase text-xl tracking-normal text-gray-500 dark:text-gray-400">
            Deposit BTC
          </div>
          {(() => {
            const showBalance =
              balance !== undefined && Number.isFinite(balance);
            if (!showBalance) return null;
            return (
              <div className="text-xs text-gray-600 dark:text-gray-300 font-matter-mono italic opacity-50">
                {balance!.toLocaleString(undefined, { maximumFractionDigits: 8 })} BTC available
              </div>
            );
          })()}
        </div>
        <Field name="amount" placeholder="Amount">
          {({ field, meta, form }: FieldProps) => {
            const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
              const finalValue = sanitizeAmountInput(e.target.value);
              form.setFieldValue("amount", finalValue);
            };

            const { onChange: _onChange, ...fieldProps } = field;

            return (
              <>
                <Textarea
                  onChange={handleChange}
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
                  {...fieldProps}
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
