import classes from "./ClaimsForm.module.css";
import MotorClaimsForm from "../MotorClaimsForm/MotorClaimsForm";
import PropertyClaimForm from "../PropertyClaimForm/PropertyClaimForm";
import { usePolicyInventoryById, useUserPolicyById } from "@/hooks/usePolicies";
import Loader from "@/components/Loader/Loader";
import { useEffect, useMemo, useState } from "react";
import {
  claimsDataType,
  inventoryType,
  requestType,
  userPoliciesType,
  vehiclesType,
} from "@/utilities/types";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import { useToast } from "@/context/ToastContext";
import HealthClaimsForm from "../HealthClaimsForm/HealthClaimsForm";
import { vehicleTypes } from "@/utilities/motorInsuranceData";

type ClaimsFormTypes = {
  onClose: () => void;
  selectedPolicyId: string | null;
  selectedSubPolicyId?: string;
  refetchFunction?: () => void;
};

const ClaimsForm = ({
  onClose,
  selectedPolicyId,
  selectedSubPolicyId,
  refetchFunction,
}: ClaimsFormTypes) => {
  // Requests
  const { isLoading, data: policyData } = useUserPolicyById(
    selectedPolicyId as string
  );
  const { isLoading: policyInventoryisLoading, data: subPolicyData } =
    usePolicyInventoryById(
      selectedPolicyId as string,
      selectedSubPolicyId as string
    );

  // States
  const [claimsData, setClaimsData] = useState<claimsDataType>({
    dateAndTime: "",
    registrationNumber: "",
    location: "",
    narration: "",
  });

  const [propertyClaimsData, setPropertyClaimsData] = useState<claimsDataType>({
    dateAndTime: "",
    location: "",
    narration: "",
    type: "",
    estimate: "",
    property: "",
  });

  const [healthClaimsData, setHealthClaimsData] = useState<claimsDataType>({
    enroleeId: "",
    attachments: [],
    dateAndTime: "",
    narration: "",
  });
  const [healthClaimsDataFormData, setHealthClaimsDataFormData] = useState(
    new FormData()
  );

  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

  // Memo
  const policy: userPoliciesType = useMemo(
    () => policyData?.data?.policy,
    [policyData]
  );

  const inventory: vehiclesType | inventoryType = useMemo(
    () => subPolicyData?.data?.inventory,
    [policyData]
  );

  // Hooks
  const { errorFlowFunction } = useError();
  const { showToast } = useToast();

  // Requests
  const claimsHandler = () => {
    requestHandler({
      url: "/policies/policy/claim",
      data:
        policy?.insuranceType === "building" ||
        policy?.insuranceType === "all-risk" ||
        policy?.insuranceType === "all-risks"
          ? {
              insuranceId: selectedPolicyId,
              ...propertyClaimsData,
              subPolicyId: selectedSubPolicyId,
            }
          : policy?.insuranceType?.toLowerCase()?.includes("motor")
          ? {
              insuranceId: selectedPolicyId,
              ...claimsData,
              subPolicyId: selectedSubPolicyId,
            }
          : healthClaimsDataFormData,
      method: "POST",
      isMultipart:
        policy?.insuranceType === "building" ||
        policy?.insuranceType === "all-risk" ||
        policy?.insuranceType === "all-risks"
          ? false
          : policy?.insuranceType?.toLowerCase().includes("motor")
          ? false
          : true,
      id: "claim-policy",
      state: requestState,
      setState: setRequestState,
      errorFunction(err) {
        errorFlowFunction(err);
      },
      successFunction(res) {
        if (refetchFunction) {
          refetchFunction();
        }
        showToast(res?.data?.message, "success");
        setClaimsData({
          dateAndTime: "",
          registrationNumber: "",
          location: "",
          narration: "",
          subPolicyId: "",
        });
        setPropertyClaimsData({
          dateAndTime: "",
          location: "",
          narration: "",
          type: "",
          estimate: "",
          property: "",
          subPolicyId: "",
        });
        setHealthClaimsData({
          enroleeId: "",
          attachments: [],
        });
        onClose();
      },
    });
  };

  // Effects
  useEffect(() => {
    const subHealthFormData = new FormData();

    subHealthFormData.append("insuranceId", selectedPolicyId as string);
    subHealthFormData.append(
      "enroleeId",
      healthClaimsData?.enroleeId as string
    );
    subHealthFormData.append(
      "narration",
      healthClaimsData?.narration as string
    );
    subHealthFormData.append(
      "dateAndTime",
      healthClaimsData?.dateAndTime as string
    );

    healthClaimsData?.attachments?.forEach((data) => {
      return subHealthFormData?.append("attachments", data);
    });

    setHealthClaimsDataFormData(subHealthFormData);
  }, [healthClaimsData]);

  if (isLoading || policyInventoryisLoading) {
    return <Loader />;
  }

  return (
    <form className={classes.container}>
      {policy?.insuranceType?.toLowerCase().includes("motor") ? (
        <MotorClaimsForm
          onClose={onClose}
          data={policy}
          requestState={requestState}
          claimsData={claimsData}
          setClaimsData={setClaimsData}
          claimsHandler={claimsHandler}
          inventory={inventory as vehiclesType}
        />
      ) : policy.insuranceType?.toLowerCase().includes("hmo") ? (
        <HealthClaimsForm
          onClose={onClose}
          data={policy}
          requestState={requestState}
          claimsData={healthClaimsData}
          setClaimsData={setHealthClaimsData}
          claimsHandler={claimsHandler}
        />
      ) : (
        <PropertyClaimForm
          onClose={onClose}
          data={policy}
          requestState={requestState}
          claimsData={propertyClaimsData}
          setClaimsData={setPropertyClaimsData}
          claimsHandler={claimsHandler}
          inventory={inventory as inventoryType}
        />
      )}
    </form>
  );
};

export default ClaimsForm;
