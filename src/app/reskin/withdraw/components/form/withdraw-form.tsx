"use client";
import { walletInfoAtom } from "@/util/atoms";
import { Form, Formik } from "formik";
import { useAtomValue } from "jotai";
import { useMemo, useRef } from "react";
import * as yup from "yup";

import { AmountInput } from "./amount-input";
import { AddressInput } from "./address-input";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useRouter } from "next/navigation";
import { elide } from "@/util";

import { withdrawStepper } from "../stepper";
import { WithdrawTimeline } from "../withdraw-stepper";
import { FormButton } from "@/app/reskin/components/form-button";
import { useSubmitWithdraw } from "../../hooks/use-submit-withdraw";
import { useWithdrawalValidation } from "../../hooks/withdrawal-validation";

const { useStepper, utils } = withdrawStepper;

export const WithdrawForm = () => {
  const router = useRouter();

  const submitWithdraw = useSubmitWithdraw();

  const { addresses } = useAtomValue(walletInfoAtom);
  const btcAddress = addresses.payment?.address;

  const { addressValidationSchema, amountValidationSchema } =
    useWithdrawalValidation();
  const withdrawalSchema = useMemo(() => {
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
        address: btcAddress || "",
      }}
      enableReinitialize={true}
      validationSchema={withdrawalSchema}
      onSubmit={async (values: Values) => {
        const txId = await submitWithdraw({
          address: values.address,
          amount: values.amount,
        });
        if (txId) {
          router.push(`/reskin/withdraw/${txId}`);
        }
      }}
    >
      {({ errors, touched, isValid, values, submitForm, getFieldMeta }) => (
        <>
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
          <WithdrawTimeline />
        </>
      )}
    </Formik>
  );
};
