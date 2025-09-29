import { Field, FieldProps, FormikProps } from "formik";
import { InputContainer } from "../form-elements/input-container";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { elide } from "@/util";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { DepositFormValues } from "./deposit-form-values";
import { bnsNameToAddress } from "@/actions/bns-client";
import { isValidBNSName } from "@/util/bns";

export const AddressInput = ({
  isReadonly,
  onClickEdit,
  value,
  error,
  onPressEnter,
  isEditable,
  children,
}: {
  isReadonly: boolean;
  onClickEdit?: () => void;
  value: string;
  error?: string | boolean;
  onPressEnter?: () => void;
  isEditable: boolean;
  children?: any;
}) => {
  const isMobile = useIsMobile();

  async function resolveBNSName(
    name: string,
    form: FormikProps<DepositFormValues>,
  ) {
    if (form.values.addressType == "bns" && isValidBNSName(name)) {
      form.setFieldValue("resolveStatus", "resolving");
      try {
        const address = await bnsNameToAddress(name);
        if (address) form.setFieldError("resolvedAddress", undefined);
        form.setFieldTouched("resolvedAddress", true);
        form.setFieldValue("resolvedAddress", address);
        form.setFieldValue("resolveStatus", "resolved");
        validateForm(form);
      } catch (error) {
        console.log(`Cannot resolve BNS name ${name}`);
        form.setFieldValue("resolvedAddress", "");
        form.setFieldTouched("resolvedAddress", true);
        form.setFieldValue("resolveStatus", "error");
        validateForm(form);
      }
    }
  }

  function resetField(
    fieldName: keyof DepositFormValues,
    form: FormikProps<DepositFormValues>,
    defaultValue: string | null = null,
  ) {
    const val =
      defaultValue != null ? defaultValue : form.initialValues[fieldName];
    form.setFieldValue(fieldName, val);
    form.setFieldError(fieldName, undefined);
    form.setFieldTouched(fieldName, false);
  }

  function validateForm(form: FormikProps<DepositFormValues>) {
    setTimeout(() => form.validateForm(), 10);
  }

  return (
    <InputContainer
      isReadonly={isReadonly}
      onClickEdit={onClickEdit}
      isEditable={isEditable}
      title="Selected Deposit Address"
      readonlyValue={elide(value, isMobile ? 20 : 8)}
    >
      <div
        className={`md:ml-14 text-black min-h-48 rounded-2xl bg-transparent border p-3 ${
          error
            ? "border-red-500"
            : "border-black dark:border-white border-opacity-20 dark:border-opacity-20"
        }`}
      >
        <Field name="addressType">
          {({ field, form }: FieldProps) => (
            <Select
              value={field.value}
              onValueChange={(value: string) => {
                form.setFieldValue(field.name, value);
                if (value === "bns") resetField("address", form, "");
                else resetField("address", form);
                resetField("resolvedAddress", form);
                resetField("resolveStatus", form);
                validateForm(form);
              }}
            >
              <SelectTrigger className="w-auto border-0 bg-lightGray dark:bg-ship-gray dark:text-white rounded-3xl focus:ring-offset-0 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-ship-gray">
                <SelectItem value="stx">STX Address</SelectItem>
                <SelectItem value="bns">BNS Name</SelectItem>
              </SelectContent>
            </Select>
          )}
        </Field>

        <Field name="address" placeholder="Address">
          {({ field, meta, form }: FieldProps) => {
            field.onChange = (e: any) => {
              form.handleChange(e);
              if (
                form.values.addressType == "bns" &&
                (form.values.resolvedAddress ||
                  form.errors.resolvedAddress ||
                  form.errors.address)
              ) {
                resetField("resolvedAddress", form);
                resetField("resolveStatus", form);
                validateForm(form);
              }
            };
            field.onBlur = (e: any) => {
              form.handleBlur(e);
              const val: string = e.target.value;
              resolveBNSName(val, form);
            };
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
                  className="font-matter-mono text-black dark:text-white w-full bg-transparent break-all text-2xl tracking-tight placeholder:text-xl placeholder:tracking-normal placeholder:font-matter"
                  {...field}
                  placeholder={
                    form.values.addressType === "bns"
                      ? "Enter BNS name to receive sBTC"
                      : "Enter STX address to receive sBTC"
                  }
                />
                {meta.touched && meta.error ? (
                  <div className="text-red-500">{meta.error}</div>
                ) : null}
              </>
            );
          }}
        </Field>
        {children}
      </div>
    </InputContainer>
  );
};
