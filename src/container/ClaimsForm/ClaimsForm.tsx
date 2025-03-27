import Input from "@/components/Input/Input";
import classes from "./ClaimsForm.module.css";
import MotorClaimsForm from "../MotorClaimsForm/MotorClaimsForm";
import PropertyClaimForm from "../PropertyClaimForm/PropertyClaimForm";
import { useUserPolicyById } from "@/hooks/usePolicies";
import Loadable from "next/dist/shared/lib/loadable.shared-runtime";
import Loader from "@/components/Loader/Loader";
import { useMemo, useState } from "react";
import {
  claimsDataType,
  requestType,
  userPoliciesType,
} from "@/utilities/types";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import { useToast } from "@/context/ToastContext";
import { setAllModalsFalse } from "@/helpers/modalHandlers";

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

  const [propertyClaimsData, setPropertyClaimsData] = useState<claimsDataType>({
    dateAndTime: "",
    location: "",
    narration: "",
    type: "",
    estimate: "",
    property: "",
  });

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

  console.log(policy, "Policy");

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
          : { insuranceId: selectedPolicyId, ...claimsData },
      method: "POST",
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
        onClose();
      },
    });
  };

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
