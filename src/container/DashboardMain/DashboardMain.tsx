"use client";

import GreetingComponent from "@/components/GreetingComponent/GreetingComponent";
import classes from "./DashboardMain.module.css";
import Table from "@/components/Table/Table";
import DashboardPoliciesSummary from "../DashboardPoliciesSummary/DashboardPoliciesSummary";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import { modalGenericType, userPoliciesType } from "@/utilities/types";
import ClaimsForm from "../ClaimsForm/ClaimsForm";
import { useUserPolicy } from "@/hooks/usePolicies";
import { structureWords } from "@/helpers/capitalize";
import moment from "moment";

export const headers = [
  "Policy Held",
  "Expiration Date",
  "Agent",
  "Status",
  "Actions",
];

type DashboardMainTypes = {
  userPolicies: userPoliciesType[];
  className?: string;
};

const DashboardMain = ({ userPolicies, className }: DashboardMainTypes) => {
  // States
  const [modals, setModals] = useState<modalGenericType>({
    claims: false,
  });
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);

  // Effects
  useEffect(() => {
    if (userPolicies?.length > 0) {
      const newUserPolicies = userPolicies?.map((data: any) => {
        console.log(data, "Wyd");

        return {
          policyHeld: structureWords(data?.insuranceType),
          exporationDate: moment(data?.endDate)?.format("Do MMMM, YYYY"),
          agent: `${data?.agent?.firstName} ${data?.agent?.lastName}`,
          status: data?.status || "pending",
          isActive: false,
          id: data?._id,
          tracker: data?.isTrackerInstalled,
          firstName: data?.user?.firstName,
          lastName: data?.user?.lastName,
          plan: data?.plan,
          insuranceType: data?.insuranceType,
          email: data?.user?.email,
          registrationNumber: data?.registrationNumber,
          chasisNumber: data?.chasisNumber,
          phone: data?.user?.phone,
        };
      });

      setPolicies(newUserPolicies as any);
    }
  }, [userPolicies]);

  // Utils
  const options = [
    {
      text: "Claim",
      action: (insuranceId?: string) => {
        setModalTrue(setModals, "claims");
        if (insuranceId) {
          setSelectedPolicyId(insuranceId);
        }
      },
    },

    {
      text: "Download Policy Certificate",
      action: () => {},
      isActive: true,
    },
  ];

  return (
    <>
      {modals.claims && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <ClaimsForm
              onClose={() => setAllModalsFalse(setModals)}
              selectedPolicyId={selectedPolicyId}
            />
          }
        />
      )}
      <section className={`${classes.container} ${className}`}>
        <GreetingComponent />
        <DashboardPoliciesSummary />
        <Table
          header="Policies"
          data={policies}
          headers={headers}
          options={options}
        />
      </section>
    </>
  );
};

export default DashboardMain;
