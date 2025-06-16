"use client";

import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import classes from "./PolicyDetails.module.css";
import PolicyDetailsSummary from "../PolicyDetailsSummary/PolicyDetailsSummary";
import BreadCrumbMenu from "@/components/BreadCrumbMenu/BreadCrumbMenu";
import { routes } from "@/utilities/routes";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import CustomTable from "@/components/CustomTable/CustomTable";
import {
  inventoryType,
  modalGenericType,
  requestType,
  vehiclesType,
} from "@/utilities/types";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import ClaimsForm from "../ClaimsForm/ClaimsForm";
import Modal from "@/components/Modal/Modal";
import { useUserPolicyById } from "@/hooks/usePolicies";
import InventoryDetails from "../InventoryDetails/InventoryDetails";
import { hyphenateAndLowerCase, structureWords } from "@/helpers/capitalize";
import { mutate } from "swr";
import RenewVehiclePapersModalBody from "../RenewVehiclePapersModalBody/RenewVehiclePapersModalBody";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import { AuthContext } from "@/context/AuthContext";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import { useToast } from "@/context/ToastContext";
import PolicyDetailsDetails from "../PolicyDetailsDetails/PolicyDetailsDetails";

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
    renewVehiclePapers: false,
    payment: false,
  });
  const [selectedSubPolicyId, setSelectedSubPolicyId] = useState<string | null>(
    null
  );
  const [isRoadWorthiness, setIsRoadWorthiness] = useState(false);
  const [isVehicleLicense, setIsVehicleLicense] = useState(false);
  const [vehicleRenewalFormData, setVehicleRenewalFormData] =
    useState<FormData>(new FormData());
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

  // Context
  const { user } = useContext(AuthContext);

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

    {
      text: "Renew vehicle papers",
      action: () => {
        setAllModalsFalse(setModals);
        setModalTrue(setModals, "renewVehiclePapers");
      },
      isVisible: (data: any) => {
        return Boolean(data?.insuranceType) && data?.status === "active";
      },
    },
  ];

  // Requests
  const { isLoading, data } = useUserPolicyById(policyId as string);

  // Hooks
  const { errorFlowFunction } = useError();
  const { showToast } = useToast();

  // Memos
  const inventory: inventoryType[] = useMemo(() => {
    return data?.data?.policy?.inventory;
  }, [data]);

  const inventoryDetailsMemo = useMemo(() => {
    const selectedInventory: vehiclesType = data?.data?.policy?.inventory?.find(
      (data: any) => {
        return data?._id === selectedSubPolicyId;
      }
    );

    const inventoryDetails = {
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      registrationNumber: selectedInventory?.registrationNumber,
      chasisNumber: selectedInventory?.chassisNumber,
      policyType: `${hyphenateAndLowerCase(
        selectedInventory?.insuranceType
      )}-motor-insurance`,
      premium: 0,
    };

    return inventoryDetails;
  }, [selectedSubPolicyId]);

  // Requests
  const handleVehiclePaperRenewalinitiation = () => {
    requestHandler({
      url: "/super-agent/initiate-paper-renewal/inventory",
      method: "POST",
      data: vehicleRenewalFormData,
      isMultipart: true,
      state: requestState,
      setState: setRequestState,
      errorFunction(err) {
        errorFlowFunction(err);
      },
      successFunction(res) {
        showToast(res?.data?.message, "success");
        setAllModalsFalse(setModals);
        setIsRoadWorthiness(false);
        setIsVehicleLicense(false);
        mutate(`/policies/user/policy/${policyId}`);
      },
    });
  };

  // Effects
  useEffect(() => {
    if (data) {
      setBreadCrubmRoutes((prevState) => {
        const updatedState = [...prevState];
        updatedState[1].title = structureWords(
          data?.data?.policy?.insuranceType
        );
        return updatedState;
      });
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

      {modals.renewVehiclePapers && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <RenewVehiclePapersModalBody
              onClose={() => setAllModalsFalse(setModals)}
              inventoryId={selectedSubPolicyId as string}
              id={policyId as string}
              isRoadWorthiness={isRoadWorthiness}
              isVehicleLicense={isVehicleLicense}
              setIsRoadWorthiness={setIsRoadWorthiness}
              setIsVehicleLicense={setIsVehicleLicense}
              setVehicleRenewalFOrmData={setVehicleRenewalFormData}
              onRenew={() => {
                setAllModalsFalse(setModals);
                setModalTrue(setModals, "payment");
              }}
            />
          }
        />
      )}

      {modals.payment && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <PaymentModalBody
              data={inventoryDetailsMemo as any}
              onClose={() => {
                setAllModalsFalse(setModals);
                setIsRoadWorthiness(false);
                setIsVehicleLicense(false);
              }}
              policyType={"motor-insurance"}
              policySubType={inventoryDetailsMemo?.policyType?.toLowerCase()}
              hasRoadWorthinessRevnewal={isRoadWorthiness}
              onSuccess={() => {
                handleVehiclePaperRenewalinitiation();
              }}
              hasLicenseRenewal={isVehicleLicense}
              loading={requestState?.isLoading}
            />
          }
        />
      )}

      <DashboardLayout className={classes.container}>
        <BreadCrumbMenu routes={breadCrumbRoutes} />
        <PolicyDetailsSummary />
        <PolicyDetailsDetails data={data?.data?.policy} loading={isLoading} />
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
