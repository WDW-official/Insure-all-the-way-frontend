"use client";

import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import classes from "./PolicyDetails.module.css";
import PolicyDetailsSummary from "../PolicyDetailsSummary/PolicyDetailsSummary";
import BreadCrumbMenu from "@/components/BreadCrumbMenu/BreadCrumbMenu";
import { routes } from "@/utilities/routes";
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import CustomTable from "@/components/CustomTable/CustomTable";
import { modalGenericType } from "@/utilities/types";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import ClaimsForm from "../ClaimsForm/ClaimsForm";
import Modal from "@/components/Modal/Modal";

const fields = ["specifications", "serialNumber", "cost"];
const header = ["Spefications", "Serial Number", "Cost"];

const PolicyDetails = () => {
  // Router
  const pathname = usePathname();
  const { policyId } = useParams();

  // Utils
  const [breadCrumbRoutes, setBreadCrubmRoutes] = useState([
    {
      title: "Dashboard",
      route: routes.DASHBOARD,
    },
    {
      title: "All Risk Policy",
      route: pathname,
    },
  ]);
  const [modals, setModals] = useState<modalGenericType>({
    details: false,
    claims: false,
  });
  const [selectedSubPolicyId, setSelectedSubPolicyId] = useState<string | null>(
    null
  );

  const dummyData = [
    {
      specifications: "Macbook Pro 2020 8GB 256GB SSD 13inch",
      serialNumber: "C02DL32NP3XY",
      cost: "₦745,000.00",
    },
    {
      specifications: "Macbook Pro 2020 8GB 256GB SSD 13inch",
      serialNumber: "C02DL32NP3XY",
      cost: "₦745,000.00",
    },
    {
      specifications: "Macbook Pro 2020 8GB 256GB SSD 13inch",
      serialNumber: "C02DL32NP3XY",
      cost: "₦745,000.00",
    },
    {
      specifications: "Macbook Pro 2020 8GB 256GB SSD 13inch",
      serialNumber: "C02DL32NP3XY",
      cost: "₦745,000.00",
    },
  ];

  const options = [
    {
      text: "View Details",
      action: () => {},
    },
    {
      text: "Claim",
      action: (subPolicy: any) => {
        setSelectedSubPolicyId(subPolicy?._id);
        setModalTrue(setModals, "claims");
      },
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
              selectedPolicyId={policyId as string}
            />
          }
        />
      )}
      <DashboardLayout className={classes.container}>
        <BreadCrumbMenu routes={breadCrumbRoutes} />
        <PolicyDetailsSummary />
        <CustomTable
          fields={fields}
          header="Inventory"
          data={dummyData}
          headers={header}
          isOptions
          options={options}
          setState={setSelectedSubPolicyId}
        />
      </DashboardLayout>
    </>
  );
};

export default PolicyDetails;
