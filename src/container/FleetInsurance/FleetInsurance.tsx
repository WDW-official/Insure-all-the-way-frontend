"use client";

import React, { useContext, useEffect, useState } from "react";
import FleetInsuranceHero from "../FleetInsuranceHero/FleetInsuranceHero";
import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import FleetInsuranceForm from "../FleetInsuranceForm/FleetInsuranceForm";
import { AuthContext } from "@/context/AuthContext";
import {
  fleetFormDataTypes,
  modalGenericType,
  requestType,
} from "@/utilities/types";
import { requestHandler } from "@/helpers/requestHandler";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import useError from "@/hooks/useError";
import Modal from "@/components/Modal/Modal";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";

const FleetInsurance = () => {
  // States
  const [fleetInsuranceFormData, setFleetInsuranceFormData] =
    useState<fleetFormDataTypes>({
      firstName: "",
      propertyType: "",
      lastName: "",
      email: "",
      phone: "",
      state: "",
      address: "",
      startDate: "",
      endDate: "",
      gender: "",
      occupation: "",
      inventory: [],
    });
  const [fleetInsuranceFormDataFormData, setFleetInsuranceFormDataFormData] =
    useState(new FormData());

  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

  const [modals, setModals] = useState<modalGenericType>({
    insuranceCreated: false,
  });

  // Hooks
  const { errorFlowFunction } = useError();

  // Context
  const { user } = useContext(AuthContext);

  // Request
  const fleetSubmissionFormHandler = () => {
    requestHandler({
      url: "/policies/policy/motor-insurance/fleet-motor-insurance",
      isMultipart: true,
      method: "POST",
      id: "submit-form",
      data: fleetInsuranceFormDataFormData,
      state: requestState,
      setState: setRequestState,
      successFunction() {
        setModalTrue(setModals, "insuranceCreated");
        setFleetInsuranceFormData((prevState) => {
          return {
            ...prevState,
            propertyType: "",
            startDate: "",
            endDate: "",
            inventory: [
              {
                chassisNumber: "",
                registrationNumber: "",
                modelOfVehicle: "",
                makeOfVehicle: "",
                yearOfMake: "",
                vehicleType: "",
                engineNumber: "",
              },
            ],
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
      setFleetInsuranceFormData((prevState) => {
        return {
          ...prevState,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          phone: user?.phone,
          address: user?.address,
          state: user?.state,
          gender: user?.gender,
          occupation: user?.occupation,
        };
      });
    }
  }, [user]);

  useEffect(() => {
    const subFleetInsuranceFormData = new FormData();

    subFleetInsuranceFormData.append(
      "firstName",
      fleetInsuranceFormData?.firstName
    );
    subFleetInsuranceFormData.append(
      "lastName",
      fleetInsuranceFormData?.lastName
    );
    subFleetInsuranceFormData.append("email", fleetInsuranceFormData?.email);
    subFleetInsuranceFormData.append("phone", fleetInsuranceFormData?.phone);
    subFleetInsuranceFormData.append(
      "address",
      fleetInsuranceFormData?.address
    );

    subFleetInsuranceFormData.append(
      "occupation",
      fleetInsuranceFormData?.occupation
    );

    subFleetInsuranceFormData.append("gender", fleetInsuranceFormData?.gender);
    subFleetInsuranceFormData.append("state", fleetInsuranceFormData?.state);

    subFleetInsuranceFormData.append(
      "propertyType",
      fleetInsuranceFormData?.propertyType
    );

    subFleetInsuranceFormData.append(
      "startDate",
      fleetInsuranceFormData?.startDate
    );
    subFleetInsuranceFormData.append(
      "endDate",
      fleetInsuranceFormData?.endDate
    );
    subFleetInsuranceFormData.append(
      "inventory",
      JSON.stringify(fleetInsuranceFormData.inventory)
    );
    setFleetInsuranceFormDataFormData(subFleetInsuranceFormData);
  }, [fleetInsuranceFormData]);

  return (
    <>
      {modals.insuranceCreated && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              title="Your have successfully applied for a Fleet Motor Insurance Policy!"
              caption="An agent will get back to you regarding next steps."
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
        <FleetInsuranceHero />
        <FleetInsuranceForm
          data={fleetInsuranceFormData}
          setData={setFleetInsuranceFormData}
          onSubmit={fleetSubmissionFormHandler}
          requestState={requestState}
        />
      </ApppLayout>
    </>
  );
};

export default FleetInsurance;
