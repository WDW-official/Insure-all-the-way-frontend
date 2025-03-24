"use client";

import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import ComprehensiveMotorInsuranceHero from "../ComprehensiveMotorInsuranceHero/ComprehensiveMotorInsuranceHero";
import ComprehensiveMotorInsuranceForm from "../ComprehensiveMotorInsuranceForm/ComprehensiveMotorInsuranceForm";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  comprehensiveeFormDataTypes,
  modalGenericType,
  requestType,
} from "@/utilities/types";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import { useCars } from "@/hooks/usePolicies";
import { capitalize } from "@/helpers/capitalize";

const ComprehensiveMotorInsurance = () => {
  // Context
  const { user } = useContext(AuthContext);

  // Hooks
  const { errorFlowFunction } = useError();

  // States
  const [comprehensiveFormData, setComprehensiveFormData] =
    useState<comprehensiveeFormDataTypes>({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      state: "",
      registrationNumber: "",
      chassisNumber: "",
      coverPeriod: "1 year",
      vehicleValue: "",
      premium: "",
      startDate: "",
      endDate: "",
      gender: "",
      occupation: "",
      address: "",
      makeOfVehicle: "",
      yearOfMake: "",
      modelOfVehicle: "",
    });

  const [comprehensiceFormDataFormData, setCOmprehensiveFormDataFormData] =
    useState(new FormData());
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });
  const [modals, setModals] = useState<modalGenericType>({
    payment: false,
    success: false,
    insuranceSuccess: false,
  });

  // Requests
  const comprenhensiveSubmissionFormHandler = () => {
    requestHandler({
      url: "/policies/policy/motor-insurance/comprehensive-motor-insurance",
      isMultipart: true,
      method: "POST",
      id: "submit-form",
      data: comprehensiceFormDataFormData,
      state: requestState,
      setState: setRequestState,
      successFunction(res) {
        setModalTrue(setModals, "insuranceSuccess");

        setComprehensiveFormData((prevState) => {
          return {
            ...prevState,
            registrationNumber: "",
            coverPeriod: "1 year",
            vehicleValue: "",
            startDate: "",
            endDate: "",
            chassisNumber: "",
            makeOfVehicle: "",
            yearOfMake: "",
            modelOfVehicle: "",
          };
        });
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
    });
  };

  // Effects
  useEffect(() => {
    if (user) {
      setComprehensiveFormData((prevState) => {
        return {
          ...prevState,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          phone: user?.phone,
          state: user?.state,
          address: user?.address,
          occupation: user?.occupation,
          gender: user?.gender,
        };
      });
    }
  }, [user]);

  useEffect(() => {
    const subComprehensiveFormData = new FormData();

    subComprehensiveFormData.append(
      "firstName",
      comprehensiveFormData?.firstName
    );
    subComprehensiveFormData.append(
      "lastName",
      comprehensiveFormData?.lastName
    );
    subComprehensiveFormData.append("email", comprehensiveFormData?.email);
    subComprehensiveFormData.append("phone", comprehensiveFormData?.phone);
    subComprehensiveFormData.append("state", comprehensiveFormData?.state);
    subComprehensiveFormData.append(
      "registrationNumber",
      comprehensiveFormData?.registrationNumber
    );
    subComprehensiveFormData.append(
      "coverPeriod",
      comprehensiveFormData?.coverPeriod
    );
    subComprehensiveFormData.append(
      "carValue",
      comprehensiveFormData?.vehicleValue
    );
    subComprehensiveFormData.append("premium", comprehensiveFormData?.premium);
    subComprehensiveFormData.append(
      "startDate",
      comprehensiveFormData?.startDate
    );
    subComprehensiveFormData.append("endDate", comprehensiveFormData?.endDate);
    subComprehensiveFormData.append("state", comprehensiveFormData?.state);
    subComprehensiveFormData.append("gender", comprehensiveFormData?.gender);
    subComprehensiveFormData.append(
      "occupation",
      comprehensiveFormData?.occupation
    );
    subComprehensiveFormData.append(
      "chassisNumber",
      comprehensiveFormData?.chassisNumber
    );
    subComprehensiveFormData.append(
      "makeOfVehicle",
      comprehensiveFormData?.makeOfVehicle
    );
    subComprehensiveFormData.append(
      "modelOfVehicle",
      comprehensiveFormData?.modelOfVehicle
    );
    subComprehensiveFormData.append(
      "yearOfMake",
      comprehensiveFormData?.yearOfMake
    );

    setCOmprehensiveFormDataFormData(subComprehensiveFormData);
  }, [comprehensiveFormData]);

  return (
    <>
      {modals.insuranceSuccess && (
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
              data={comprehensiveFormData as any}
              onClose={() => setAllModalsFalse(setModals)}
            />
          }
        />
      )}

      {modals.success && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              title="Your have successfully applied for a Comprehensive Motor Insurance Policy!"
              caption="Please check your mail to get your dashboard login details. Make sure you change your temporary password as soon as possible. "
              onClose={() => setAllModalsFalse(setModals)}
              onClick={() => {
                setAllModalsFalse(setModals);
              }}
              buttontext="Okay"
            />
          }
        />
      )}
      <ApppLayout>
        <ComprehensiveMotorInsuranceHero />
        <ComprehensiveMotorInsuranceForm
          data={comprehensiveFormData}
          setData={setComprehensiveFormData}
          onSubmit={comprenhensiveSubmissionFormHandler}
          requestState={requestState}
        />
      </ApppLayout>
    </>
  );
};

export default ComprehensiveMotorInsurance;
