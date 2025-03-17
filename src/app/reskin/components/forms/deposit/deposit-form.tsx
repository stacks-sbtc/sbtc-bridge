"use client";
import useMintCaps from "@/hooks/use-mint-caps";
import { bridgeConfigAtom, walletInfoAtom } from "@/util/atoms";
import { Form, Formik, FormikHelpers } from "formik";
import { useAtomValue } from "jotai";
import { useMemo, useRef } from "react";
import * as yup from "yup";
import { FormButton } from "../../form-button";
import { useValidateDepositAmount } from "@/hooks/use-validate-deposit-amount";
import { useQuery } from "@tanstack/react-query";
import getBtcBalance from "@/actions/get-btc-balance";

import { depositStepper } from "../../stepper/deposit/util";
import { AmountInput } from "./amount-input";
import { testStxAddress } from "@/util/yup/test-stx-address";
import { AddressInput } from "./address-input";
import { useIsMobile } from "@/hooks/use-is-mobile";

const { useStepper, utils } = depositStepper;

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
        .required(),

    [WALLET_NETWORK],
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
  const stepper = useStepper();
  const handleEdit = (fieldName: keyof Values) => {
    stepper.goTo(fieldName);
  };

  const handleNextClick = () => {
    if (!stepper.isLast) {
      stepper.next();
    }
    if (utils.getNext(stepper.current.id).id === "confirm") {
      nextButtonRef.current?.focus();
    }
  };

  const handlePrevClick = () => {
    if (!stepper.isFirst) {
      stepper.prev();
    }
  };

  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const isMobile = useIsMobile();

  const handleEnter = (error?: string) => {
    if (!error) {
      handleNextClick();
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
      {({ errors, touched, isValid, values, submitForm, getFieldMeta }) => (
        <Form className="flex flex-col justify-center md:justify-normal gap-2 w-full px-6 lg:w-1/2 max-w-xl min-h-full">
          <div className="flex flex-col gap-2 flex-1">
            {(!isMobile || stepper.current.id !== "address") && (
              <AmountInput
                value={`${values.amount} BTC`}
                isReadonly={stepper.when(
                  "amount",
                  () => false,
                  () => true,
                )}
                onClickEdit={() => handleEdit("amount")}
                onPressEnter={() => {
                  return touched.amount && handleEnter(errors.amount);
                }}
                error={touched.amount && errors.amount}
              />
            )}

            {stepper.current.id !== "amount" && (
              <AddressInput
                value={values.address}
                isReadonly={stepper.when(
                  "address",
                  () => false,
                  () => true,
                )}
                onPressEnter={() => handleEnter(errors.address)}
                onClickEdit={() => handleEdit("address")}
                error={touched.address && errors.address}
              />
            )}
          </div>

          <div className="flex gap-5 w-full md:pl-14 self-end">
            {!stepper.isFirst && !stepper.isLast && (
              <FormButton
                onClick={handlePrevClick}
                type="button"
                variant="secondary"
                className={"flex-1 md:flex-[4]"}
              >
                back
              </FormButton>
            )}

            <FormButton
              buttonRef={nextButtonRef}
              onClick={handleNextClick}
              disabled={!!getFieldMeta(stepper.current.id).error && !isValid}
              type={stepper.isLast ? "submit" : "button"}
              className="flex-1 md:flex-[8]"
            >
              {stepper.switch({
                address: () => (isValid ? "review" : "next"),
                amount: () => "next",
                confirm: () => "confirm",
                status: () => "view history",
              })}
            </FormButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};
