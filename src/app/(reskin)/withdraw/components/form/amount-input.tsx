import { Field, FieldProps } from "formik";
import { ChangeEvent } from "react";

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
        className={`md:ml-14 text-black min-h-48 rounded-2xl bg-transparent border p-3 ${error ? "border-red-500" : "border-black dark:border-white border-opacity-20 dark:border-opacity-20"}`}
      >
        <div className="bg-lightGray dark:bg-input-label-dark dark:text-white flex items-center justify-center rounded-full w-28 h-10">
          sBTC
        </div>
        <Field name="amount" placeholder="Amount">
          {({ field, meta, form }: FieldProps) => {
            const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
              const rawValue = e.target.value;
              const sanitizedValue = rawValue.replace(/[^0-9.]/g, "");

              if (sanitizedValue === "") {
                form.setFieldValue("amount", "");
                return;
              }

              const parts = sanitizedValue.split(".");
              const integerPart = parts[0].replace(/^0+/, '') || '0';
              const decimalPart = parts.length > 1 ? parts[1] : "";

              const finalValue = parts.length > 1 ? `${integerPart}.${decimalPart}` : integerPart;
              form.setFieldValue("amount", finalValue);
            };

            const { onChange: _onChange, ...fieldProps } = field;

            return (
              <>
                <Textarea
                  onChange={handleChange}
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
                  className="text-black dark:text-white w-full bg-transparent break-all text-5xl tracking-tight h-8 placeholder:text-xl placeholder:tracking-normal text-center placeholder:text-left"
                  {...fieldProps}
                  placeholder="Enter sBTC amount to withdraw"
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
