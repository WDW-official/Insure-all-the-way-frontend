"use client";

import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import classes from "./PolicyDetails.module.css";
import PolicyDetailsSummary from "../PolicyDetailsSummary/PolicyDetailsSummary";
import BreadCrumbMenu from "@/components/BreadCrumbMenu/BreadCrumbMenu";
import { routes } from "@/utilities/routes";
import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import CustomTable from "@/components/CustomTable/CustomTable";
import { inventoryType, modalGenericType } from "@/utilities/types";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import ClaimsForm from "../ClaimsForm/ClaimsForm";
import Modal from "@/components/Modal/Modal";
import { useUserPolicyById } from "@/hooks/usePolicies";
import InventoryDetails from "../InventoryDetails/InventoryDetails";
import { structureWords } from "@/helpers/capitalize";
import { mutate } from "swr";

const fields = {
  "all-risk": ["specifications", "serialNumber", "value", "status"],
  "fleet-motor-insurance": [
    "registrationNumber",
    "vehicleType",
    "makeOfVehicle",
    "modelOfVehicle",
    "status",
  ],
};
const header = {
  "all-risk": ["Spefications", "Serial Number", "Value", "Status"],
  "fleet-motor-insurance": [
    "Registration Number",
    "Vehicle Type",
    "Make of Vehicle",
    "Model of Vehicle",
    "Status",
  ],
};

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

  const options = [
    {
      text: "View Details",
      action: (subPolicy: any) => {
        setSelectedSubPolicyId(subPolicy?._id);
        setModalTrue(setModals, "details");
      },
    },
    {
      text: "Claim",
      action: (subPolicy: any) => {
        setSelectedSubPolicyId(subPolicy?._id);
        setModalTrue(setModals, "claims");
      },
    },
  ];

  // Requests
  const { isLoading, data } = useUserPolicyById(policyId as string);

  // Memos
  const inventory: inventoryType[] = useMemo(() => {
    return data?.data?.policy?.inventory;
  }, [data]);

  // Effects
  useEffect(() => {
    if (data) {
      console.log(data, "test");

      setBreadCrubmRoutes((prevState) => {
        const updatedState = [...prevState];
        updatedState[1].title = structureWords(
          data?.data?.policy?.insuranceType
        );
        return updatedState;
      });

      console.log(
        structureWords(data?.data?.policy?.insuranceType),
        "Type",
        data?.data
      );
    }
  }, [data]);

  return (
    <>
      {modals.claims && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <ClaimsForm
              onClose={() => setAllModalsFalse(setModals)}
              selectedPolicyId={policyId as string}
              selectedSubPolicyId={selectedSubPolicyId as string}
              refetchFunction={() => {
                mutate(`/policies/user/policy/${policyId}`);
              }}
            />
          }
        />
      )}

      {modals.details && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <InventoryDetails
              onClose={() => setAllModalsFalse(setModals)}
              inventoryId={selectedSubPolicyId as string}
            />
          }
        />
      )}
      <DashboardLayout className={classes.container}>
        <BreadCrumbMenu routes={breadCrumbRoutes} />
        <PolicyDetailsSummary />
        <CustomTable
          fields={
            fields[
              data?.data?.policy?.insuranceType as
                | "all-risk"
                | "fleet-motor-insurance"
            ] || []
          }
          header="Inventory"
          data={inventory}
          headers={
            header[
              data?.data?.policy?.insuranceType as
                | "all-risk"
                | "fleet-motor-insurance"
            ] || []
          }
          isOptions
          options={options}
          setState={setSelectedSubPolicyId}
          loading={isLoading}
          onRowClick={() => setModalTrue(setModals, "details")}
        />
      </DashboardLayout>
    </>
  );
};

export default PolicyDetails;
