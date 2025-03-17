import { Field, FieldProps } from "formik";
import { InputContainer } from "../form-elements/input-container";

import { Textarea } from "@/components/ui/textarea";
import { elide } from "@/util";

export const AddressInput = ({
  isReadonly,
  onClickEdit,
  value,
  error,
  onPressEnter,
}: {
  isReadonly: boolean;
  onClickEdit: () => void;
  value: string;
  error?: string | boolean;
  onPressEnter?: () => void;
}) => {
  return (
    <InputContainer
      isReadonly={isReadonly}
      onClickEdit={onClickEdit}
      title="Selected Deposit Address"
      value={elide(value)}
    >
      <div
        className={`text-black min-h-48 rounded-2xl bg-transparent border p-3 ${error ? "border-red-500" : "border-black dark:border-white border-opacity-20 dark:border-opacity-20"}`}
      >
        <div className="bg-gray dark:bg-input-label-dark dark:text-white flex items-center justify-center rounded-full w-32 h-10">
          STX Address
        </div>
        <Field name="address" placeholder="Address">
          {({ field, meta }: FieldProps) => {
            return (
              <>
                <Textarea
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
                  className="text-black dark:text-white w-full bg-transparent break-all text-2xl tracking-tight placeholder:text-xl placeholder:tracking-normal"
                  {...field}
                  placeholder="Enter STX address to receive sBTC"
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
