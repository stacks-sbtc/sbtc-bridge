import { Field, FieldProps, useFormikContext } from "formik";
import { InputContainer } from "@/app/(reskin)/components/forms/form-elements/input-container";
import { useSBTCBalance } from "@/hooks/use-sbtc-balance";
import { walletInfoAtom } from "@/util/atoms";
import { useAtomValue } from "jotai";

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
  const { addresses } = useAtomValue(walletInfoAtom);
  const stxAddress = addresses.stacks?.address;
  const { data: sbtcBalance, isLoading } = useSBTCBalance({
    address: stxAddress,
  });
  const { setFieldValue } = useFormikContext();

  const formattedBalance =
    sbtcBalance !== undefined ? Number(sbtcBalance) / 1e8 : 0;

  const handleMaxClick = () => {
    if (formattedBalance > 0) {
      setFieldValue("amount", formattedBalance.toString());
    }
  };

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
        <div className="flex items-center justify-between">
          <div className="bg-lightGray dark:bg-input-label-dark dark:text-white flex items-center justify-center rounded-full w-28 h-10">
            sBTC
          </div>
          {stxAddress && (
            <div className="flex items-center gap-2 text-sm text-darkGray dark:text-gray-400">
              <span>
                Available:{" "}
                {isLoading ? "..." : `${formattedBalance.toFixed(8)} sBTC`}
              </span>
              {formattedBalance > 0 && (
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className="text-orange dark:text-dark-reskin-orange hover:underline font-medium"
                >
                  MAX
                </button>
              )}
            </div>
          )}
        </div>
        <Field name="amount" placeholder="Amount">
          {({ field, meta }: FieldProps) => {
            return (
              <>
                <input
                  type="number"
                  step="any"
                  min="0"
                  disabled={isDisabled}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      onPressEnter?.();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                  autoFocus
                  className="text-black dark:text-white w-full bg-transparent text-5xl tracking-tight min-h-16 placeholder:text-xl placeholder:tracking-normal outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  {...field}
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
