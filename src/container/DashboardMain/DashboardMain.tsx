"use client";

import GreetingComponent from "@/components/GreetingComponent/GreetingComponent";
import classes from "./DashboardMain.module.css";
import DashboardPoliciesSummary from "../DashboardPoliciesSummary/DashboardPoliciesSummary";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import {
  modalGenericType,
  policyResponseType,
  requestType,
  userPoliciesType,
} from "@/utilities/types";
import ClaimsForm from "../ClaimsForm/ClaimsForm";
import { structureWords } from "@/helpers/capitalize";
import CustomTable from "@/components/CustomTable/CustomTable";
import PolicyInformationModalBody from "../PolicyInformationModalBody/PolicyInformationModalBody";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import RenewVehiclePapersModalBody from "../RenewVehiclePapersModalBody/RenewVehiclePapersModalBody";
import { useRouter } from "next/navigation";
import { routes } from "@/utilities/routes";
import useError from "@/hooks/useError";
import { useToast } from "@/context/ToastContext";
import { requestHandler } from "@/helpers/requestHandler";
import { mutate } from "swr";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";

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
    renewalSuccess: false,
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
  const [isKora, setIsKora] = useState(false);

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
        const today: any = new Date();
        const endDate: any = new Date(insurance.exporationDate);

        const diffInMs = endDate - today;
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays > 30) {
          showToast(
            "This policy is not valid for renewal. Policies must have 30 days to expiry before they are valid for renewal.",
            "warning"
          );
          return;
        }

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
      isVisible: (policy: any) =>
        policy?.policyHeld.toLowerCase().includes("third") ||
        policy?.policyHeld.toLowerCase().includes("comprehensive"),
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

  const selectedPolicyFullDetails = useMemo(() => {
    const selectedPolicyInfo = userPolicies?.find(
      (data) => data?._id === selectedPolicyId
    );

    return selectedPolicyInfo;
  }, [selectedPolicyId]);

  // Requests
  const handleRenewal = () => {
    requestHandler({
      url: `/policies/policy/${selectedPolicyFullDetails?._id}/renew`,
      method: "PUT",
      state: requestState,
      setState: setRequestState,
      id: "renew-policy",
      successFunction() {
        mutate("/policies/user/policy");
        setAllModalsFalse(setModals);
        setModalTrue(setModals, "renewalSuccess");
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
    });
  };

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
              data={selectedPolicyFullDetails as any}
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
                handleRenewal();
              }}
              loading={
                requestState?.isLoading && requestState?.id === "renew-policy"
              }
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
                setIsKora(true);
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
              isKora={isKora}
            />
          }
        />
      )}

      {modals.renewalSuccess && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              onClose={() => {
                setAllModalsFalse(setModals);
              }}
              title="Policy Renewed Successfully!"
              caption={`You have successfully renewed this policy. The policy start and end dates have been updated, and you have been notified via e-mail.`}
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
