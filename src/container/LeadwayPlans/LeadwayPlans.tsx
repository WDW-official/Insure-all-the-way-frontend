"use client";

import {
  individualHeader,
  individualPlans,
  leadwayPlans,
  seniorCitizenHeader,
  seniorCitizensPlans,
} from "@/utilities/leadwayPlans";
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
    "description",
    "strawberry",
    "cranberry",
    "blueberry",
    "blackberry",
    "raspberry",
  ],
  "Senior Citizens": [
    "description",
    "cranberry",
    "blueberry",
    "blackberry",
    "raspberry",
  ],
};

const headers = {
  Individual: individualHeader,
  "Senior Citizens": seniorCitizenHeader,
};

const tableData = {
  Individual: individualPlans,
  "Senior Citizens": seniorCitizensPlans,
};

const LeadwayPlans = () => {
  // States
  const [navItems, setNavItems] = useState<navItemTypes[]>(
    leadwayPlans?.map((data, i) => {
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
  const { isLoading, data: healthPlansData } = useHealthPlans("leadway");

  //   Utils
  const activeNav = navItems?.find((data) => data?.isActive);

  // Memo
  const axaPlansMemo: policySubTypePlansType[] = useMemo(() => {
    return healthPlansData?.data?.plans;
  }, [healthPlansData]);

  return (
    <section className={classes.container}>
      <h4>Leadway</h4>
      <p>Preview all Leadway's Plans in one glance</p>
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
              activeNav?.title as "Individual" | "Senior Citizens"
            ] as any[]) || []
          }
          fields={
            (fields[
              activeNav?.title as "Individual" | "Senior Citizens"
            ] as string[]) || []
          }
          header={activeNav?.title}
          headers={
            headers[activeNav?.title as "Individual" | "Senior Citizens"] || []
          }
        />
      )}

      <IndividualAndFamilyHmoForm2 data={data} setData={setData} />
    </section>
  );
};

export default LeadwayPlans;
