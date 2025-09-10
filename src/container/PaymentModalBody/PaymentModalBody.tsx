"use client";

declare global {
  interface Window {
    Korapay: any;
    payKorapay?: () => void;
  }
}

import React, { useMemo } from "react";
import classes from "./PaymentModalBody.module.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Close from "@/assets/svgIcons/Close";
import { policyResponseType, policySubTypePlansType } from "@/utilities/types";
import { usePolicyTypeBySubtype } from "@/hooks/usePolicies";
import Loader from "@/components/Loader/Loader";
import { formatCurrency } from "@/helpers/formatAmount";
import { PAYSTACK_PUBLIC_KEY } from "@/config/paystack";
import dynamic from "next/dynamic";
import { hyphenateAndLowerCase } from "@/helpers/capitalize";
import {
  ROADWORTHINESS_PRICE,
  VEHICLE_LICENSE_PRICE,
} from "@/utilities/constants";
import { generateId } from "@/helpers/generateId";

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

type PaymentModalBodyType = {
  onSuccess: () => void;
  data: policyResponseType;
  onClose: () => void;
  policyType?: string;
  policySubType?: string;
  hasLicenseRenewal?: boolean;
  hasRoadWorthinessRevnewal?: boolean;
  loading?: boolean;
  isKora?: boolean;
};

const PaymentModalBody = ({
  onSuccess,
  data,
  onClose,
  policyType,
  policySubType,
  hasRoadWorthinessRevnewal,
  hasLicenseRenewal,
  loading,
  isKora,
}: PaymentModalBodyType) => {
  // Requests
  const { isLoading, data: policySubtypeData } = usePolicyTypeBySubtype(
    policyType || "motor-insurance",
    policySubType || "third-party-motor-insurance"
  );

  // Memos
  const policyData = useMemo(
    () =>
      policySubtypeData?.data?.plans?.find(
        (plan: policySubTypePlansType) =>
          hyphenateAndLowerCase(plan?.name) ===
          hyphenateAndLowerCase(data?.plan)
      ),
    [policySubtypeData]
  );

  const basePrice =
    Number(policyData?.price) ||
    Number(data?.valueOfProperty) ||
    Number(data?.premium) ||
    0;

  const basePriceWithLicenseRenewal = Number(basePrice) + VEHICLE_LICENSE_PRICE;
  const basePriceWithRoadWorthinessRenewal = basePrice + ROADWORTHINESS_PRICE;
  const basePriceWithVehicleLicenseRenewalAndRoadWorthinessRenewal =
    basePrice + VEHICLE_LICENSE_PRICE + ROADWORTHINESS_PRICE;

  // Utils
  const componentProps = {
    email: data?.user?.email,
    amount:
      hasLicenseRenewal && !hasRoadWorthinessRevnewal
        ? basePriceWithLicenseRenewal * 100
        : !hasLicenseRenewal && hasRoadWorthinessRevnewal
        ? basePriceWithRoadWorthinessRenewal * 100
        : hasLicenseRenewal && hasLicenseRenewal
        ? basePriceWithVehicleLicenseRenewalAndRoadWorthinessRenewal * 100
        : basePrice * 100,
    metadata: {
      name: `${data?.user?.lastName || ""} ${data?.user?.firstName || ""}`,
      phone: data?.user?.phone,
      custom_fields: [],
    },
    text: "Pay",
    onSuccess: () => {
      onSuccess();
    },
    publicKey: PAYSTACK_PUBLIC_KEY as string,
  };

  if (isLoading || loading) {
    return <Loader />;
  }

  return (
    <div className={classes.container}>
      <Close onClick={onClose} />
      <h4>Please confirm your payment details</h4>

      <Input
        label="Fullname"
        placeholder="Eg. John Doe"
        readOnly
        value={`${data?.user?.firstName} ${data?.user?.lastName}`}
      />
      <Input
        label="Email"
        placeholder="Eg abc@example.com"
        readOnly
        value={data?.user?.email}
      />
      <Input label="Phone" type="phone" readOnly value={data?.user?.phone} />

      {policyType?.includes("motor") && data?.registrationNumber && (
        <>
          <Input
            label="Registration Number"
            readOnly
            value={data?.registrationNumber}
          />
          {data?.chasisNumber && (
            <Input label="Chassis Number" readOnly value={data?.chasisNumber} />
          )}
        </>
      )}

      <Input
        label="Amount"
        readOnly
        value={`₦${formatCurrency(
          hasLicenseRenewal && !hasRoadWorthinessRevnewal
            ? basePriceWithLicenseRenewal
            : !hasLicenseRenewal && hasRoadWorthinessRevnewal
            ? basePriceWithRoadWorthinessRenewal
            : hasLicenseRenewal && hasRoadWorthinessRevnewal
            ? basePriceWithVehicleLicenseRenewalAndRoadWorthinessRenewal
            : basePrice
        )}`}
      />

      {!isKora ? (
        <PaystackButton
          {...componentProps}
          disabled={
            !data?.user?.firstName ||
            !data?.user?.lastName ||
            policySubtypeData?.price ||
            !data?.user?.email
          }
          className={classes.paystackButton}
        />
      ) : (
        <Button
          onClick={() => {
            if (typeof window !== "undefined") {
              const newId = generateId();

              window?.Korapay?.initialize({
                key: process.env.NEXT_PUBLIC_KORAPAY_PUBLIC_KEY,
                reference: newId,
                amount:
                  hasLicenseRenewal && !hasRoadWorthinessRevnewal
                    ? basePriceWithLicenseRenewal
                    : !hasLicenseRenewal && hasRoadWorthinessRevnewal
                    ? basePriceWithRoadWorthinessRenewal
                    : hasLicenseRenewal && hasLicenseRenewal
                    ? basePriceWithVehicleLicenseRenewalAndRoadWorthinessRenewal
                    : basePrice,
                currency: "NGN",
                customer: {
                  name: `${data?.user?.lastName || ""} ${
                    data?.user?.firstName || ""
                  }`,
                  email: data?.user?.email,
                },
                notification_url:
                  "https://insure-all-the-way-backend-2.onrender.com/api/payments/kora",
                channels: [
                  "bank_transfer",
                  "card",
                  "pay_with_bank",
                  "mobile_money",
                ],
                onSuccess: () => {
                  onSuccess();
                },
              });
            }
          }}
        >
          Pay
        </Button>
      )}
    </div>
  );
};

export default PaymentModalBody;
