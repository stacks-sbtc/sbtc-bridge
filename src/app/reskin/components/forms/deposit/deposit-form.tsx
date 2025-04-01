"use client";
import useMintCaps from "@/hooks/use-mint-caps";
import { bridgeConfigAtom, walletInfoAtom } from "@/util/atoms";
import { Form, Formik } from "formik";
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
import { useRouter } from "next/navigation";
import { elide } from "@/util";
import { useSendDeposit } from "@/app/reskin/hooks/use-send-deposit";

const { useStepper, utils } = depositStepper;

export const DepositForm = () => {
  const { currentCap, perDepositMinimum } = useMintCaps();
  const maxDepositAmount = currentCap / 1e8;
  const minDepositAmount = perDepositMinimum / 1e8;
  const { WALLET_NETWORK } = useAtomValue(bridgeConfigAtom);
  const router = useRouter();

  const { depositToAddress } = useSendDeposit();

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
    if (stepper.current.id !== "status") {
      stepper.goTo(fieldName);
    }
  };

  const handleNextClick = () => {
    if (!stepper.isLast) {
      stepper.next();
    } else {
      // FIXME: need to change when reskin is released
      router.push(`/reskin/history`);
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
      onSubmit={async (values: Values) => {
        const depositInfo = await depositToAddress({
          stxAddress: values.address,
          amount: Number(values.amount) * 1e8,
        });

        if (depositInfo) {
          router.push(`/reskin/${depositInfo.bitcoinTxid}`);
        }
      }}
    >
      {({ errors, touched, isValid, values, submitForm, getFieldMeta }) => (
        <Form className="flex flex-col justify-center items-center md:justify-normal gap-2 w-full px-6 lg:w-1/2 max-w-xl flex-1">
          <div
            className={`flex flex-col gap-2 flex-1 justify-center md:justify-normal w-full h-full`}
          >
            {(!isMobile ||
              stepper.current.id === "amount" ||
              stepper.current.id === "confirm" ||
              stepper.current.id === "status") && (
              <AmountInput
                value={`${values.amount} BTC`}
                isReadonly={stepper.current.id !== "amount"}
                onClickEdit={() => handleEdit("amount")}
                isEditable={stepper.current.id !== "status"}
                onPressEnter={() => {
                  return touched.amount && handleEnter(errors.amount);
                }}
                error={touched.amount && errors.amount}
              />
            )}

            {(stepper.current.id === "address" ||
              stepper.current.id === "confirm" ||
              stepper.current.id === "status") && (
              <AddressInput
                value={elide(values.address, isMobile ? 20 : 8)}
                isReadonly={stepper.current.id !== "address"}
                isEditable={stepper.current.id !== "status"}
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
              onClick={
                stepper.current.id === "confirm"
                  ? async () => {
                      await submitForm();
                    }
                  : handleNextClick
              }
              disabled={!!getFieldMeta(stepper.current.id).error && !isValid}
              type="button"
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
