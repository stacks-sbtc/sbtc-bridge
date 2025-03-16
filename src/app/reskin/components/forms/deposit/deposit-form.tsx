"use client";
import useMintCaps from "@/hooks/use-mint-caps";
import { bridgeConfigAtom, walletInfoAtom } from "@/util/atoms";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import * as yup from "yup";
import { FormButton } from "../../form-button";
import { useValidateDepositAmount } from "@/hooks/use-validate-deposit-amount";
import { useQuery } from "@tanstack/react-query";
import getBtcBalance from "@/actions/get-btc-balance";

import { InputContainer } from "../form-elements/input-container";
import { elide } from "@/util";
import { depositStepper } from "../../stepper/deposit/util";
import { AmountInput } from "./amount-input";
import { testStxAddress } from "@/util/yup/test-stx-address";

export const DepositForm = () => {
  const { currentCap, perDepositMinimum } = useMintCaps();
  const maxDepositAmount = (currentCap || 1e8) / 1e8;
  const minDepositAmount = (perDepositMinimum || 10_000) / 1e8;
  const { WALLET_NETWORK } = useAtomValue(bridgeConfigAtom);

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
  const addressValidationSchema = useMemo(
    () =>
      yup
        .string()
        .test("stx-address", "Invalid STX address", function (value) {
          return testStxAddress.call(this, value, WALLET_NETWORK!);
        })
        .required()
        .default(addresses.stacks?.address || ""),
    [WALLET_NETWORK, addresses.stacks?.address],
  );

  const depositSchema = useMemo(() => {
    return yup.object().shape({
      amount: amountValidationSchema,
      address: addressValidationSchema,
    });
  }, [addressValidationSchema, amountValidationSchema]);

  type Values = {
    amount: string;
    address: string;
  };
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
        amount: "",
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
      {({ errors, touched, isValid, values }) => (
        <Form className="flex flex-col gap-2 w-full px-6 lg:w-1/2 max-w-lg">
          <AmountInput
            value={`${values.amount} BTC`}
            isReadonly={stepper.when(
              "amount",
              () => false,
              () => true,
            )}
            onClickEdit={() => handleEdit("amount")}
            error={touched.amount && errors.amount}
          />

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
