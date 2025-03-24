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
  thirdPartyInsuranceFormTypes,
} from "@/utilities/types";
import { usePolicyTypeBySubtype } from "@/hooks/usePolicies";
import Loader from "@/components/Loader/Loader";
import { formatCurrency } from "@/helpers/formatAmount";
import { PAYSTACK_PUBLIC_KEY } from "@/config/paystack";
import dynamic from "next/dynamic";

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

type PaymentModalBodyType = {
  onSuccess: () => void;
  data: thirdPartyInsuranceFormTypes &
    enhancedThirdPartyInsuranceFormTypes &
    comprehensiveeFormDataTypes;
  onClose: () => void;
};

const PaymentModalBody = ({
  onSuccess,
  data,
  onClose,
}: PaymentModalBodyType) => {
  // Requests
  const { isLoading, data: policySubtypeData } = usePolicyTypeBySubtype(
    "motor-insurance",
    "third-party-motor-insurance"
  );

  // Memos
  const policyData = useMemo(
    () =>
      policySubtypeData?.data?.plans?.find(
        (plan: policySubTypePlansType) =>
          plan?.name === data?.product || plan?.name === data?.plan
      ),
    [policySubtypeData]
  );

  // Utils
  const componentProps = {
    email: data?.email,
    amount: Number(policyData?.price) * 100,
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
      <Input
        label="Phone"
        type="phone"
        readOnly
        value={data?.phoneNumber || data?.phone}
      />
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
