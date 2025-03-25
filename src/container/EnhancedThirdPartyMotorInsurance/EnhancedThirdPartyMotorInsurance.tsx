"use client";

import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import EnhancedThirdPartyMotorInsuranceHero from "../EnhancedThirdPartyMotorInsuranceHero/EnhancedThirdPartyMotorInsuranceHero";
import EnhancedThirdPartyMotorInsuranceForm from "../EnhancedThirdPartyMotorInsuranceForm/EnhancedThirdPartyMotorInsuranceForm";
import { useEffect, useMemo, useState } from "react";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { usePolicyTypeBySubtype } from "@/hooks/usePolicies";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import {
  enhancedThirdPartyInsuranceFormTypes,
  modalGenericType,
  requestType,
} from "@/utilities/types";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import Modal from "@/components/Modal/Modal";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";

const EnhancedThirdPartyMotorInsurance = () => {
  // Hooks
  const { isLoading, data } = usePolicyTypeBySubtype(
    "motor-insurance",
    "enhanced-third-party-motor-insurance"
  );
  const { updateSearchParams } = useUpdateSearchParams();

  // States
  const [enhancedThirdPartyFormData, setEnhancedThirdPartyFormData] =
    useState<enhancedThirdPartyInsuranceFormTypes>({
      makeOfVehicle: "",
      yearOfMake: "",
      modelOfVehicle: "",
      startDate: "",
      endDate: "",
      registrationNumber: "",
      engineNumber: "",
      chasisNumber: "",
      vehicleType: "",
      proofOfOwnership: null,
      plan: "",
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      inspectionState: "",
      inspectionAddress: "",
      dateForInspection: "",
      contactName: "",
      contactPhone: "",
      occupation: "",
      gender: "",
    });

  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });
  // Modals
  const [modals, setModals] = useState<modalGenericType>({
    insuranceCreated: false,
    payment: false,
    success: false,
  });

  // Hooks
  const { errorFlowFunction } = useError();

  const [
    enhancedThirdPartyFormDataFormdata,
    setEnhancedThirdPartyFormDataFormdata,
  ] = useState(new FormData());

  // Requests
  const enhancedThirdPartySubmissionFOrmHandler = () => {
    requestHandler({
      url: "/policies/policy/motor-insurance/enhanced-third-party-motor-insurance",
      isMultipart: true,
      method: "POST",
      id: "submit-form",
      data: enhancedThirdPartyFormDataFormdata,
      state: requestState,
      setState: setRequestState,
      successFunction(res) {
        setModalTrue(setModals, "insuranceCreated");
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
    });
  };

  // MEmos
  const policySubType = useMemo(() => data?.data, [data]);

  // Effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      updateSearchParams("step", "1", "set");
    }
  }, []);

  useEffect(() => {
    const subEnhancedThirdPartyFormData = new FormData();

    subEnhancedThirdPartyFormData.append(
      "makeOfVehicle",
      enhancedThirdPartyFormData?.makeOfVehicle
    );

    subEnhancedThirdPartyFormData.append(
      "modelOfVehicle",
      enhancedThirdPartyFormData?.modelOfVehicle
    );

    subEnhancedThirdPartyFormData.append(
      "yearOfMake",
      enhancedThirdPartyFormData?.yearOfMake
    );
    subEnhancedThirdPartyFormData.append(
      "startDate",
      enhancedThirdPartyFormData?.startDate
    );
    subEnhancedThirdPartyFormData.append(
      "endDate",
      enhancedThirdPartyFormData?.endDate
    );
    subEnhancedThirdPartyFormData.append(
      "registrationNumber",
      enhancedThirdPartyFormData?.registrationNumber
    );
    subEnhancedThirdPartyFormData.append(
      "engineNumber",
      enhancedThirdPartyFormData?.engineNumber
    );

    subEnhancedThirdPartyFormData.append(
      "chasisNumber",
      enhancedThirdPartyFormData?.chasisNumber
    );

    subEnhancedThirdPartyFormData.append(
      "vehicleType",
      enhancedThirdPartyFormData?.vehicleType
    );
    subEnhancedThirdPartyFormData.append(
      "proofOfOwnership",
      enhancedThirdPartyFormData?.proofOfOwnership as File
    );
    subEnhancedThirdPartyFormData.append(
      "plan",
      enhancedThirdPartyFormData?.plan
    );
    subEnhancedThirdPartyFormData.append(
      "id",
      enhancedThirdPartyFormData?.id as File
    );

    subEnhancedThirdPartyFormData.append(
      "firstName",
      enhancedThirdPartyFormData?.firstName
    );
    subEnhancedThirdPartyFormData.append(
      "lastName",
      enhancedThirdPartyFormData?.lastName
    );
    subEnhancedThirdPartyFormData.append(
      "email",
      enhancedThirdPartyFormData?.email
    );
    subEnhancedThirdPartyFormData.append(
      "phone",
      enhancedThirdPartyFormData?.phone
    );
    subEnhancedThirdPartyFormData.append(
      "address",
      enhancedThirdPartyFormData?.address
    );

    subEnhancedThirdPartyFormData.append(
      "state",
      enhancedThirdPartyFormData?.state
    );
    subEnhancedThirdPartyFormData.append(
      "inspectionState",
      enhancedThirdPartyFormData?.inspectionState
    );
    subEnhancedThirdPartyFormData.append(
      "inspectionAddress",
      enhancedThirdPartyFormData?.inspectionAddress
    );
    subEnhancedThirdPartyFormData.append(
      "dateForInspection",
      enhancedThirdPartyFormData?.dateForInspection
    );
    subEnhancedThirdPartyFormData.append(
      "contactName",
      enhancedThirdPartyFormData?.contactName
    );
    subEnhancedThirdPartyFormData.append(
      "contactPhone",
      enhancedThirdPartyFormData?.contactPhone
    );
    subEnhancedThirdPartyFormData.append(
      "occupation",
      enhancedThirdPartyFormData?.occupation
    );
    subEnhancedThirdPartyFormData.append(
      "gender",
      enhancedThirdPartyFormData?.gender
    );

    setEnhancedThirdPartyFormDataFormdata(subEnhancedThirdPartyFormData);
  }, [enhancedThirdPartyFormData]);

  return (
    <ApppLayout>
      {modals.insuranceCreated && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              title="Your Insurance Policy has been successfully created!"
              caption="Please pay so we can walk you through the last step of this process"
              onClose={() => setAllModalsFalse(setModals)}
              onClick={() => {
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
              onSuccess={() => {
                setAllModalsFalse(setModals);
                setModalTrue(setModals, "success");
              }}
              data={enhancedThirdPartyFormData as any}
              onClose={() => setAllModalsFalse(setModals)}
              policyType="motor-insurance"
              policySubType="enhanced-third-party-motor-insurance"
            />
          }
        />
      )}

      {modals.success && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              title="Your have successfully applied for an Enhanced Third Party Motor Insurance Policy!"
              caption="Please check your mail to get your dashboard login details. Make sure you change your temporary password as soon as possible. "
              onClose={() => setAllModalsFalse(setModals)}
              onClick={() => {
                setAllModalsFalse(setModals);
                setEnhancedThirdPartyFormData((prevState) => {
                  return {
                    ...prevState,
                    makeOfVehicle: "",
                    yearOfMake: "",
                    modelOfVehicle: "",
                    startDate: "",
                    endDate: "",
                    registrationNumber: "",
                    engineNumber: "",
                    chasisNumber: "",
                    vehicleType: "",
                    proofOfOwnership: null,
                    plan: "",
                    id: null,
                    inspectionState: "",
                    inspectionAddress: "",
                    dateForInspection: "",
                    contactName: "",
                    contactPhone: "",
                  };
                });
                updateSearchParams("step", "1", "set");
              }}
              buttontext="Okay"
            />
          }
        />
      )}
      <EnhancedThirdPartyMotorInsuranceHero
        data={policySubType}
        loading={isLoading}
        setData={setEnhancedThirdPartyFormData}
      />
      <EnhancedThirdPartyMotorInsuranceForm
        data={enhancedThirdPartyFormData}
        setData={setEnhancedThirdPartyFormData}
        submitForm={enhancedThirdPartySubmissionFOrmHandler}
        requestState={requestState}
      />
    </ApppLayout>
  );
};

export default EnhancedThirdPartyMotorInsurance;
