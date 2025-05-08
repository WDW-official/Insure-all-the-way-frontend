"use client";

import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import React, { useMemo } from "react";
import MotorInsuranceHero from "../MotorInsuranceHero/MotorInsuranceHero";
import InsuranceTypes from "@/components/InsuranceTypes/InsuranceTypes";
import { motorInsuranceTypes } from "@/utilities/motorInsurance";
import ContactUsBanner from "../ContactUsBanner/ContactUsBanner";
import Faqs from "../Faqs/Faqs";
import classes from "./MotorInsurance.module.css";
import MotorInsurancePlans from "../MotorInsurancePlans/MotorInsurancePlans";
import { usePolicyType } from "@/hooks/usePolicies";
import { policyType } from "@/utilities/types";
import { motorInsuranceFaqs } from "@/utilities/faqs";

const MotorInsurance = () => {
  // Requests
  const { isLoading, data: policyTypeData } = usePolicyType("motor-insurance");

  const policy: policyType = useMemo(
    () => policyTypeData?.data,
    [policyTypeData]
  );

  return (
    <ApppLayout>
      <MotorInsuranceHero />
      <MotorInsurancePlans plans={policy?.types} loading={isLoading} />
      <InsuranceTypes data={motorInsuranceTypes} isNotHover />
      <div className={classes.contact}>
        <ContactUsBanner
          title="Let's Talk Motor Insurance"
          caption="Speak to an agent now to find out about our motor insurance policies. No need to stress. Sit back and enjoy the ride. We have got you covered"
        />
      </div>
      <Faqs faqs={motorInsuranceFaqs} />
    </ApppLayout>
  );
};

export default MotorInsurance;
