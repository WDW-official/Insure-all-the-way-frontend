"use client";

import {
  familyHeader,
  familyPlans,
  hygeiaPlans,
  individualHeader,
  individualPlans,
  seniorCitizensHeaders,
  seniorCitizensPlans,
  smeHeaders,
  smePlans,
} from "@/utilities/hygeiaPlans";
import classes from "../AxaPlans/AxaPlans.module.css";
import { useMemo, useState } from "react";
import {
  individualAndFamilyHmoDataTypes,
  navItemTypes,
  policySubTypePlansType,
} from "@/utilities/types";
import { hyphenateAndLowerCase } from "@/helpers/capitalize";
import { useHealthPlans } from "@/hooks/usePolicies";
import Loader from "@/components/Loader/Loader";
import RateCard from "@/components/RateCard/RateCard";
import SectionsNav from "@/components/SectionsNav/SectionsNav";
import CustomTable from "@/components/CustomTable/CustomTable";
import IndividualAndFamilyHmoForm2 from "../IndividualAndFamilyHmoForm2/IndividualAndFamilyHmoForm2";

const fields = {
  Individual: [
    "hyEssential",
    "hyBasic",
    "hyPrime",
    "hyPrimePlus",
    "hyPrimePlusExclusive",
  ],
  Family: ["hyBasicFamily", "hyPrimeFamily"],
  "Senior Citizens": [
    "seniorMini",
    "seniorMidi",
    "seniorPremium",
    "seniorExclusive",
  ],
  SMEs: ["hyStarter", "hyStarterPlus", "hyStarterPremium"],
};

const headers = {
  Individual: individualHeader,
  Family: familyHeader,
  "Senior Citizens": seniorCitizensHeaders,
  SMEs: smeHeaders,
};

const tableData = {
  Individual: individualPlans,
  Family: familyPlans,
  "Senior Citizens": seniorCitizensPlans,
  SMEs: smePlans,
};

const HygeiaPlans = () => {
  // States
  const [navItems, setNavItems] = useState<navItemTypes[]>(
    hygeiaPlans?.map((data, i) => {
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
  const { isLoading, data: plansData } = useHealthPlans("hygeia");

  //   Utils
  const activeNav = navItems?.find((data) => data?.isActive);
  const colors = ["#a7c7e7", "#ababab", "#edd014", "#909090"];

  // Memo
  const axaPlansMemo: policySubTypePlansType[] = useMemo(() => {
    return plansData?.data?.plans;
  }, [plansData]);

  return (
    <section className={classes.container}>
      <h4>Hygeia</h4>
      <p>Preview all Hygeia's Plans in one glance</p>

      <div className={classes.rateSection}>
        {isLoading ? (
          <Loader />
        ) : (
          axaPlansMemo?.map((data, i) => {
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
                theme={colors[i % colors.length]}
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
              activeNav?.title as "Individual" | "Family" | "Family" | "SMEs"
            ] as any[]) || []
          }
          fields={
            (fields[
              activeNav?.title as "Individual" | "Family" | "Family" | "SMEs"
            ] as string[]) || []
          }
          header={activeNav?.title}
          headers={
            headers[
              activeNav?.title as "Individual" | "Family" | "Family" | "SMEs"
            ] || []
          }
        />
      )}

      <IndividualAndFamilyHmoForm2 data={data} setData={setData} />
    </section>
  );
};

export default HygeiaPlans;
