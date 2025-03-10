"use client";
import useMintCaps from "@/hooks/use-mint-caps";
import { walletInfoAtom } from "@/util/atoms";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import * as yup from "yup";
import { FormButton } from "../../form-button";
import { useValidateDepositAmount } from "@/hooks/use-validate-deposit-amount";
import { useQuery } from "@tanstack/react-query";
import getBtcBalance from "@/actions/get-btc-balance";
import { validateStacksAddress } from "@stacks/transactions";
declare module "yup" {
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    stxAddress(): this;
  }
}

yup.addMethod(yup.string, "stxAddress", function () {
  return this.test("stxAddress", "Invalid Stacks address", (value) => {
    if (!value) return true;
    const isValid = validateStacksAddress(value);
    return isValid;
  });
});

export const DepositForm = () => {
  const { currentCap, perDepositMinimum } = useMintCaps();
  const maxDepositAmount = (currentCap || 1e8) / 1e8;
  const minDepositAmount = (perDepositMinimum || 10_000) / 1e8;

  const { addresses } = useAtomValue(walletInfoAtom);
  const btcAddress = addresses.payment?.address;
  const { data: btcBalance } = useQuery({
    queryKey: ["btcBalance", btcAddress],
    queryFn: async () => {
      if (!btcAddress) {
        return 0;
      }
      return getBtcBalance(btcAddress);
    },
    initialData: btcAddress ? Infinity : 0,
    enabled: !!btcAddress,
  });

  const amountValidationSchema = useValidateDepositAmount({
    maxDepositAmount,
    btcBalance,
    minDepositAmount,
  });
  const depositSchema = useMemo(() => {
    return amountValidationSchema.shape({
      depositAddress: yup
        .string()
        .stxAddress()
        .required()
        .default(addresses.stacks?.address || ""),
    });
  }, [addresses.stacks?.address, amountValidationSchema]);

  type Values = yup.InferType<typeof depositSchema>;

  return (
    <Formik
      initialValues={{
        amount: 0,
        depositAddress: addresses.stacks?.address || "",
      }}
      enableReinitialize={true}
      validationSchema={depositSchema}
      onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 500);
      }}
    >
      {({ errors, touched, isValid, isInitialValid }) => (
        <Form className="flex flex-col gap-2 w-1/2">
          <Field className="text-black" name="amount" placeholder="Amount" />
          {errors.amount && touched.amount ? <div>{errors.amount}</div> : null}
          <Field
            className="text-black"
            name="depositAddress"
            placeholder="Deposit Address"
          />
          {errors.depositAddress && touched.depositAddress ? (
            <div>{errors.depositAddress}</div>
          ) : null}
          <FormButton disabled={!isValid}>next</FormButton>
        </Form>
      )}
    </Formik>
  );
};
