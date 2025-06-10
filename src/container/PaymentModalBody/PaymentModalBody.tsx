"use client";

import React, { useMemo } from "react";
import classes from "./PaymentModalBody.module.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Close from "@/assets/svgIcons/Close";
import {
  buildingDataTypes,
  comprehensiveeFormDataTypes,
  enhancedThirdPartyInsuranceFormTypes,
  policySubTypePlansType,
  thirdPartyInsuranceFormType,
} from "@/utilities/types";
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

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

type PaymentModalBodyType = {
  onSuccess: () => void;
  data: thirdPartyInsuranceFormType &
    enhancedThirdPartyInsuranceFormTypes &
    comprehensiveeFormDataTypes &
    buildingDataTypes;
  onClose: () => void;
  policyType?: string;
  policySubType?: string;
  hasLicenseRenewal?: boolean;
  hasRoadWorthinessRevnewal?: boolean;
  loading?: boolean;
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
            hyphenateAndLowerCase(data?.product) ||
          hyphenateAndLowerCase(plan?.name) ===
            hyphenateAndLowerCase(data?.plan)
      ),
    [policySubtypeData]
  );

  const basePrice =
    Number(policyData?.price) ||
    Number(data?.premium) ||
    Number(data?.valueOfProperty);

  const basePriceWithLicenseRenewal = basePrice + VEHICLE_LICENSE_PRICE;
  const basePriceWithRoadWorthinessRenewal = basePrice + ROADWORTHINESS_PRICE;
  const basePriceWithVehicleLicenseRenewalAndRoadWorthinessRenewal =
    basePrice + VEHICLE_LICENSE_PRICE + ROADWORTHINESS_PRICE;

  // Utils
  const componentProps = {
    email: data?.email,
    amount:
      hasLicenseRenewal && !hasRoadWorthinessRevnewal
        ? basePriceWithLicenseRenewal * 100
        : !hasLicenseRenewal && hasRoadWorthinessRevnewal
        ? basePriceWithRoadWorthinessRenewal * 100
        : hasLicenseRenewal && hasLicenseRenewal
        ? basePriceWithVehicleLicenseRenewalAndRoadWorthinessRenewal * 100
        : basePrice * 100,
    metadata: {
      name: `${data?.lastName} ${data?.firstName}`,
      phone: data?.phone,
      custom_fields: [],
    },
    text: loading ? "Loading..." : "Pay",
    onSuccess: () => {
      onSuccess();
    },
    publicKey: PAYSTACK_PUBLIC_KEY as string,
  };

  if (isLoading) {
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
        value={`${data?.firstName} ${data?.lastName}`}
      />
      <Input
        label="Email"
        placeholder="Eg abc@example.com"
        readOnly
        value={data?.email}
      />
      <Input label="Phone" type="phone" readOnly value={data?.phone} />

      {policyType?.includes("motor") && data?.registrationNumber && (
        <>
          <Input
            label="Registration Number"
            readOnly
            value={data?.registrationNumber}
          />
          <Input label="Chassis Number" readOnly value={data?.chasisNumber} />
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

      <PaystackButton
        {...componentProps}
        disabled={
          !data?.firstName ||
          !data?.lastName ||
          policySubtypeData?.price ||
          !data?.email
        }
        className={classes.paystackButton}
      />
    </div>
  );
};

export default PaymentModalBody;
