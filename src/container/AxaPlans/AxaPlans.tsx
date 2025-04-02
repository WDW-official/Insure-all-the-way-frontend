"use client";

import CustomTable from "@/components/CustomTable/CustomTable";
import classes from "./AxaPlans.module.css";
import { useMemo, useState } from "react";
import {
  individualAndFamilyHmoDataTypes,
  navItemTypes,
  policySubTypePlansType,
} from "@/utilities/types";
import {
  axaInternationalPlans,
  axaInternationalPlansHeader,
  axaPlans,
  easyCarePlanHeader,
  easyCarePlans,
  retailHealthPlans,
  retailHealthPlansHeaders,
} from "@/utilities/axaplans";
import SectionsNav from "@/components/SectionsNav/SectionsNav";
import { hyphenateAndLowerCase } from "@/helpers/capitalize";
import { useHealthPlans } from "@/hooks/usePolicies";
import Loader from "@/components/Loader/Loader";
import RateCard from "@/components/RateCard/RateCard";
import IndividualAndFamilyHmo from "../IndividualAndFamilyHmo/IndividualAndFamilyHmo";
import IndividualAndFamilyHmoForm2 from "../IndividualAndFamilyHmoForm2/IndividualAndFamilyHmoForm2";

const fields = {
  "Retail Health Plan": [
    "bronze",
    "silver",
    "gold",
    "platinum",
    "platinumPlus",
    "rhodium",
  ],
  "EasyCare Plan": ["easyCare", "benefit"],
  "International Plan": ["benefits", "standard", "classic", "prime"],
};

const headers = {
  "Retail Health Plan": retailHealthPlansHeaders,
  "EasyCare Plan": easyCarePlanHeader,
  "International Plan": axaInternationalPlansHeader,
};

const tableData = {
  "Retail Health Plan": retailHealthPlans,
  "EasyCare Plan": easyCarePlans,
  "International Plan": axaInternationalPlans,
};

const AxaPlans = () => {
  // States
  const [navItems, setNavItems] = useState<navItemTypes[]>(
    axaPlans?.map((data, i) => {
      if (i === 0) {
        return { title: data, isActive: true, id: hyphenateAndLowerCase(data) };
      }
      return { title: data, isActive: false, id: hyphenateAndLowerCase(data) };
    })
  );
  const [data, setData] = useState<individualAndFamilyHmoDataTypes>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    startDate: "",
    endDate: "",
    gender: "",
    occupation: "",
    address: "",
    plan: "",
    genotype: "",
    bloodGroup: "",
    weight: "",
    height: "",
  });

  //   Hooks
  const { isLoading, data: plansData } = useHealthPlans("axa");

  //   Utils
  const activeNav = navItems?.find((data) => data?.isActive);

  // Memo
  const axaPlansMemo: policySubTypePlansType[] = useMemo(() => {
    return plansData?.data?.plans;
  }, [plansData]);

  return (
    <section className={classes.container}>
      <h4>Axa Mansard Plans</h4>
      <p>Preview all Axa Mansard's Plans in one glance</p>
      <div className={classes.rateSection}>
        {isLoading ? (
          <Loader />
        ) : (
          axaPlansMemo?.map((data) => {
            return (
              <RateCard
                title={data?.name}
                price={data?.price}
                features={data?.features}
                description={data?.description}
                onClick={() =>
                  setData((prevState) => {
                    return { ...prevState, plan: data?.name };
                  })
                }
                key={data?.name}
              />
            );
          })
        )}
      </div>

      <div className={classes.navSection}>
        <SectionsNav navItems={navItems} setNavItems={setNavItems} />
      </div>
      {activeNav && (
        <CustomTable
          data={
            (tableData[
              activeNav?.title as "Retail Health Plan" | "EasyCare Plan"
            ] as any[]) || []
          }
          fields={
            (fields[
              activeNav?.title as "Retail Health Plan" | "EasyCare Plan"
            ] as string[]) || []
          }
          header={activeNav?.title}
          headers={
            headers[
              activeNav?.title as "Retail Health Plan" | "EasyCare Plan"
            ] || []
          }
        />
      )}

      <IndividualAndFamilyHmoForm2 data={data} setData={setData} />
    </section>
  );
};

export default AxaPlans;
