import Input from "@/components/Input/Input";
import classes from "./ClaimsForm.module.css";
import MotorClaimsForm from "../MotorClaimsForm/MotorClaimsForm";
import PropertyClaimForm from "../PropertyClaimForm/PropertyClaimForm";
import { useUserPolicyById } from "@/hooks/usePolicies";
import Loadable from "next/dist/shared/lib/loadable.shared-runtime";
import Loader from "@/components/Loader/Loader";
import { useEffect, useMemo, useState } from "react";
import {
  claimsDataType,
  requestType,
  userPoliciesType,
} from "@/utilities/types";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import { useToast } from "@/context/ToastContext";
import { setAllModalsFalse } from "@/helpers/modalHandlers";
import HealthClaimsForm from "../HealthClaimsForm/HealthClaimsForm";

type ClaimsFormTypes = {
  onClose: () => void;
  selectedPolicyId: string | null;
};

const ClaimsForm = ({ onClose, selectedPolicyId }: ClaimsFormTypes) => {
  // Requests
  const { isLoading, data: policyData } = useUserPolicyById(
    selectedPolicyId as string
  );

  // States
  const [claimsData, setClaimsData] = useState<claimsDataType>({
    dateAndTime: "",
    registrationNumber: "",
    location: "",
    narration: "",
  });
  const [claimsDataFormData, setClaimsDataFormData] = useState(new FormData());

  const [propertyClaimsData, setPropertyClaimsData] = useState<claimsDataType>({
    dateAndTime: "",
    location: "",
    narration: "",
    type: "",
    estimate: "",
    property: "",
  });
  const [propertyClaimsDataFormData, setPropertyClaimsDataFormData] = useState(
    new FormData()
  );

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
          ? { insuranceId: selectedPolicyId, ...propertyClaimsData }
          : policy?.insuranceType?.toLowerCase()?.includes("motor")
          ? { insuranceId: selectedPolicyId, ...claimsData }
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
        showToast(res?.data?.message, "success");
        setClaimsData({
          dateAndTime: "",
          registrationNumber: "",
          location: "",
          narration: "",
        });
        setPropertyClaimsData({
          dateAndTime: "",
          location: "",
          narration: "",
          type: "",
          estimate: "",
          property: "",
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

  if (isLoading) {
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
        />
      )}
    </form>
  );
};

export default ClaimsForm;
