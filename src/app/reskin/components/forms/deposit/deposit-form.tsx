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
import { InputContainer } from "../form-elements/input-container";
import { elide } from "@/util";
import { depositStepper } from "../../stepper/deposit-timeline";
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
      address: yup
        .string()
        .stxAddress()
        .required()
        .default(addresses.stacks?.address || ""),
    });
  }, [addresses.stacks?.address, amountValidationSchema]);

  type Values = yup.InferType<typeof depositSchema>;
  const { useStepper } = depositStepper;
  const stepper = useStepper();
  const handleEdit = (fieldName: keyof Values) => {
    stepper.goTo(fieldName);
  };

  const handleNextClick = () => {
    if (!stepper.isLast) {
      stepper.next();
    }
  };

  return (
    <Formik
      initialValues={{
        amount: 0,
        address: addresses.stacks?.address || "",
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
      {({ errors, touched, isValid, isInitialValid, values }) => (
        <Form className="flex flex-col gap-2 w-full px-6 lg:w-1/2 max-w-lg">
          <InputContainer
            isReadonly={stepper.when(
              "amount",
              () => false,
              () => true,
            )}
            onClickEdit={() => handleEdit("amount")}
            title="Selected Deposit Amount"
            value={`${values.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} BTC`}
          >
            <Field className="text-black" name="amount" placeholder="Amount" />
            {errors.amount && touched.amount ? (
              <div>{errors.amount}</div>
            ) : null}
          </InputContainer>
          <InputContainer
            isReadonly={stepper.when(
              "address",
              () => false,
              () => true,
            )}
            onClickEdit={() => handleEdit("address")}
            title="Deposit Address"
            value={elide(values.address)}
          >
            <Field
              className="text-black"
              name="address"
              placeholder="Deposit Address"
            />
            {errors.address && touched.address ? (
              <div>{errors.address}</div>
            ) : null}
          </InputContainer>
          <FormButton
            onClick={handleNextClick}
            disabled={!isValid}
            type="button"
          >
            {stepper.isLast ? "submit" : "next"}
          </FormButton>
        </Form>
      )}
    </Formik>
  );
};
