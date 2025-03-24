"use client";

import React, { useMemo } from "react";
import classes from "./PaymentModalBody.module.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Close from "@/assets/svgIcons/Close";
import {
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

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

type PaymentModalBodyType = {
  onSuccess: () => void;
  data: thirdPartyInsuranceFormType &
    enhancedThirdPartyInsuranceFormTypes &
    comprehensiveeFormDataTypes;
  onClose: () => void;
  policyType?: string;
  policySubType?: string;
};

const PaymentModalBody = ({
  onSuccess,
  data,
  onClose,
  policyType,
  policySubType,
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
  console.log(policySubtypeData, data, "Check");

  // Utils
  const componentProps = {
    email: data?.email,
    amount: (Number(policyData?.price) || Number(data?.premium)) * 100,
    metadata: {
      name: `${data?.lastName} ${data?.firstName}`,
      phone: data?.phone,
      custom_fields: [],
    },
    text: "Pay",
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
      <Input
        label="Amount"
        readOnly
        value={`₦${formatCurrency(policyData?.price || data?.premium)}`}
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
