"use client";

import { hyphenateAndLowerCase } from "@/helpers/capitalize";
import { useMemo, useState } from "react";
import {
  individualAndFamilyHmoDataTypes,
  policySubTypePlansType,
  navItemTypes,
} from "@/utilities/types";
import {
  avonExecutiveHeader,
  avonExecutivePlans,
  avonInternationalHeader,
  avonInternationalPlans,
  avonPlans,
  corporateHeader,
  corporatePlans,
  smeHeader,
  smePlans,
} from "@/utilities/avonPlans";
import { useHealthPlans } from "@/hooks/usePolicies";
import Loader from "@/components/Loader/Loader";
import RateCard from "@/components/RateCard/RateCard";
import SectionsNav from "@/components/SectionsNav/SectionsNav";
import CustomTable from "@/components/CustomTable/CustomTable";
import classes from "../AxaPlans/AxaPlans.module.css";
import IndividualAndFamilyHmoForm2 from "../IndividualAndFamilyHmoForm2/IndividualAndFamilyHmoForm2";

export const fields = {
  Corporate: [
    "plus",
    "premium",
    "premiumPlus",
    "prestige",
    "prestigePlus",
    "executivePrestige",
  ],
  SMEs: ["smeBoss", "smePremium", "smePlus"],
  "International Plans": ["bupaGoldExclUSA", "bupaGoldInclUSA"],
  "Executive Corporate Plans": ["aceExecutive"],
};

const headers = {
  Corporate: corporateHeader,
  SMEs: smeHeader,
  "International Plans": avonInternationalHeader,
  "Executive Corporate Plans": avonExecutiveHeader,
};

const tableData = {
  Corporate: corporatePlans,
  SMEs: smePlans,
  "International Plans": avonInternationalPlans,
  "Executive Corporate Plans": avonExecutivePlans,
};

const AvonPlans = () => {
  // States
  const [navItems, setNavItems] = useState<navItemTypes[]>(
    avonPlans?.map((data, i) => {
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
  const { isLoading, data: plansData } = useHealthPlans("avon");

  //   Utils
  const activeNav = navItems?.find((data) => data?.isActive);
  const colors = ["#a7c7e7", "#ababab", "#edd014", "#909090"];

  // Memo
  const avonPlansMemo: policySubTypePlansType[] = useMemo(() => {
    return plansData?.data?.plans;
  }, [plansData]);

  return (
    <section className={classes.container}>
      <h4>Avon</h4>
      <p>Preview all Avon's Plans in one glance</p>

      <div className={classes.rateSection}>
        {isLoading ? (
          <Loader />
        ) : (
          avonPlansMemo?.map((data, i) => {
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
            (tableData[activeNav?.title as "Corporate" | "SMEs"] as any[]) || []
          }
          fields={
            (fields[activeNav?.title as "Corporate" | "SMEs"] as string[]) || []
          }
          header={activeNav?.title}
          headers={headers[activeNav?.title as "Corporate" | "SMEs"] || []}
        />
      )}

      <IndividualAndFamilyHmoForm2 data={data} setData={setData} />
    </section>
  );
};

export default AvonPlans;
