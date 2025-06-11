"use client";

import GreetingComponent from "@/components/GreetingComponent/GreetingComponent";
import classes from "./DashboardMain.module.css";
import Table from "@/components/Table/Table";
import DashboardPoliciesSummary from "../DashboardPoliciesSummary/DashboardPoliciesSummary";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import {
  modalGenericType,
  requestType,
  userPoliciesType,
} from "@/utilities/types";
import ClaimsForm from "../ClaimsForm/ClaimsForm";
import { useUserPolicy } from "@/hooks/usePolicies";
import { structureWords } from "@/helpers/capitalize";
import moment from "moment";
import CustomTable from "@/components/CustomTable/CustomTable";
import PolicyInformationModalBody from "../PolicyInformationModalBody/PolicyInformationModalBody";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import RenewVehiclePapersModalBody from "../RenewVehiclePapersModalBody/RenewVehiclePapersModalBody";
import { useRouter } from "next/navigation";
import { routes } from "@/utilities/routes";
import useError from "@/hooks/useError";
import { useToast } from "@/context/ToastContext";
import { requestHandler } from "@/helpers/requestHandler";

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
    info: false,
    revewPolicy: false,
    success: false,
    renewVehiclePapers: false,
    payment: false,
  });
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [singleData, setSingleData] = useState<any>(null);
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    error: null,
    data: null,
  });
  const [vehicleRenewalFormData, setVehicleRenewalFOrmData] = useState(
    new FormData()
  );
  const [isRoadWorthiness, setIsRoadWorthiness] = useState(false);
  const [isVehicleLicense, setIsVehicleLicense] = useState(false);

  // Router
  const router = useRouter();

  //   Hooks
  const { errorFlowFunction } = useError();
  const { showToast } = useToast();

  const handleVehiclePaperRenewalinitiation = () => {
    requestHandler({
      url: "/super-agent/initiate-paper-renewal",
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
      },
    });
  };

  // Effects
  useEffect(() => {
    if (userPolicies?.length > 0) {
      const newUserPolicies = userPolicies?.map((data: any) => {
        return {
          policyHeld: structureWords(data?.insuranceType),
          exporationDate: data?.endDate,
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
          valueOfProperty: Number(data?.valueOfProperty),
        };
      });

      setPolicies(newUserPolicies as any);
    }
  }, [userPolicies]);

  // Utils
  const options = [
    {
      text: "Claim",
      action: (insurance?: any) => {
        if (
          insurance.policyHeld === "All Risk" ||
          insurance.policyHeld === "Fleet Motor Insurance"
        ) {
          router.push(`${routes.DASHBOARD}/${insurance?.id}`);
        } else {
          setSelectedPolicyId(insurance?.id);
          setModalTrue(setModals, "claims");
        }
      },
    },

    {
      text: "Renew Policy ",
      action: (insurance: any) => {
        if (insurance) {
          setSingleData(insurance);
          setModalTrue(setModals, "revewPolicy");

          setSelectedPolicyId(insurance?.id);
        }
      },
      isActive: true,
    },

    {
      text: "Renew Vehicle Papers",
      action: (insurance: any) => {
        if (insurance) {
          setModalTrue(setModals, "renewVehiclePapers");
          setSelectedPolicyId(insurance?.id);
        }
      },
      isActive: true,
    },
  ];

  // Utils
  const selectedPolicyDetails = useMemo(() => {
    const selectedPolicyInfo = userPolicies?.find(
      (data) => data?._id === selectedPolicyId
    );
    const policyDetail = {
      email: selectedPolicyInfo?.user?.email,
      firstName: selectedPolicyInfo?.user?.firstName,
      lastName: selectedPolicyInfo?.user?.lastName,
      phone: selectedPolicyInfo?.user?.phone,
      registrationNumber: selectedPolicyInfo?.registrationNumber,
      chasisNumber: selectedPolicyInfo?.chasisNumber,
      policyType: selectedPolicyInfo?.insuranceType,
      premium: 0,
    };

    return policyDetail;
  }, [selectedPolicyId]);

  console.log(selectedPolicyDetails, "Selected User policy");

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

      {modals.info && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <PolicyInformationModalBody
              onClose={() => setAllModalsFalse(setModals)}
              id={selectedPolicyId as string}
            />
          }
        />
      )}

      {modals.revewPolicy && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <PaymentModalBody
              onClose={() => setAllModalsFalse(setModals)}
              data={singleData as any}
              policyType={
                singleData?.policyHeld?.toLowerCase()?.includes("motor")
                  ? "motor-insurance"
                  : singleData?.insuranceType?.toLowerCase() === "building"
                  ? "property-insurance"
                  : singleData?.insuranceType?.toLowerCase() === "all-risk"
                  ? "property-insurance"
                  : singleData?.insuranceType === "all-risks"
                  ? "property-insurance"
                  : "health-insurance"
              }
              policySubType={singleData?.insuranceType as any}
              onSuccess={() => {
                setAllModalsFalse(setModals);
                setModalTrue(setModals, "success");
              }}
            />
          }
        />
      )}

      {modals.renewVehiclePapers && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <RenewVehiclePapersModalBody
              onClose={() => {
                setAllModalsFalse(setModals);
                setIsRoadWorthiness(false);
                setIsVehicleLicense(false);
              }}
              id={selectedPolicyId as string}
              onRenew={() => {
                setAllModalsFalse(setModals);
                setModalTrue(setModals, "payment");
              }}
              setVehicleRenewalFOrmData={setVehicleRenewalFOrmData}
              isVehicleLicense={isVehicleLicense}
              setIsVehicleLicense={setIsVehicleLicense}
              isRoadWorthiness={isRoadWorthiness}
              setIsRoadWorthiness={setIsRoadWorthiness}
            />
          }
        />
      )}

      {modals.payment && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <PaymentModalBody
              data={selectedPolicyDetails as any}
              onClose={() => {
                setAllModalsFalse(setModals);
                setIsRoadWorthiness(false);
                setIsVehicleLicense(false);
              }}
              policyType={"motor-insurance"}
              policySubType={selectedPolicyDetails?.policyType}
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

      <section className={`${classes.container} ${className}`}>
        <GreetingComponent />
        <DashboardPoliciesSummary />

        <CustomTable
          header="Policies"
          data={policies}
          headers={headers?.filter((data) => data !== "Actions")}
          options={options}
          fields={["policyHeld", "exporationDate", "agent", "status"]}
          isOptions
          onRowClick={(data) => {
            setSelectedPolicyId(data?.id);
            if (
              data?.policyHeld === "All Risk" ||
              data?.policyHeld === "Fleet Motor Insurance"
            ) {
              router.push(`${routes.DASHBOARD}/${data?.id}`);
            } else {
              setModalTrue(setModals, "info");
            }

            setSingleData(data);
          }}
        />
      </section>
    </>
  );
};

export default DashboardMain;
