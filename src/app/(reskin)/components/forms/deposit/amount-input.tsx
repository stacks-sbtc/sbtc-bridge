import { Field, FieldProps } from "formik";
import { InputContainer } from "../form-elements/input-container";

export const AmountInput = ({
  isReadonly,
  onClickEdit,
  value,
  error,
  onPressEnter,
  isEditable,
}: {
  isReadonly: boolean;
  onClickEdit?: () => void;
  value: string;
  error?: string | boolean;
  onPressEnter?: () => void;
  isEditable?: boolean;
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
        className={`md:ml-14 text-black min-h-48 rounded-2xl bg-transparent border p-3 ${error ? "border-red-500" : "border-black dark:border-white border-opacity-20 dark:border-opacity-20"}`}
      >
        <div className="bg-lightGray dark:bg-input-label-dark dark:text-white flex items-center justify-center rounded-full w-28 h-10">
          BTC
        </div>
        <Field name="amount" placeholder="Amount">
          {({ field, meta }: FieldProps) => {
            return (
              <>
                <input
                  type="number"
                  step="any"
                  min="0"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      onPressEnter?.();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                  autoFocus
                  className="text-black dark:text-white w-full bg-transparent text-5xl tracking-tight min-h-16 placeholder:text-xl placeholder:tracking-normal outline-none"
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
