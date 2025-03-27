"use client";

import Dropdown from "@/components/Dropdown/Dropdown";
import classes from "../IndividualAndFamilyHmoForm/IndividualAndFamilyHmoForm.module.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { states } from "@/utilities/states";
import {
  buildingDataTypes,
  modalGenericType,
  requestType,
} from "@/utilities/types";
import { useContext, useEffect, useState } from "react";
import useError from "@/hooks/useError";
import { AuthContext } from "@/context/AuthContext";
import { requestHandler } from "@/helpers/requestHandler";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import Modal from "@/components/Modal/Modal";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";
import { GENDERS, TODAY } from "@/utilities/constants";
import { projectTime } from "@/helpers/projectTime";
import { capitalize } from "@mui/material";

const BuildingForm = () => {
  // States
  const [buildingFormData, setBuildingFormData] = useState<buildingDataTypes>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    state: "",
    locationOfProperty: "",
    valueOfProperty: "",
    startDate: "",
    endDate: "",
    gender: "",
    occupation: "",
  });
  const [state, setState] = useState("");
  const [modals, setModals] = useState<modalGenericType>({
    policyCreated: false,
  });
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });
  const [gender, setGender] = useState("");

  // FormData
  const [buildingFormDataFOrmData, setBuildingFormDataFormData] = useState(
    new FormData()
  );

  // Hooks
  const { errorFlowFunction } = useError();

  // Context
  const { user } = useContext(AuthContext);

  // Utils
  const buildiingFormSubmitHandler = () => {
    requestHandler({
      url: "/policies/policy/property-insurance/building",
      method: "POST",
      isMultipart: true,
      data: buildingFormDataFOrmData,
      state: requestState,
      setState: setRequestState,
      successFunction() {
        setModalTrue(setModals, "policyCreated");
        setBuildingFormData((prevstate) => {
          return {
            ...prevstate,
            locationOfProperty: "",
            valueOfProperty: "",
            startDate: "",
            endDate: "",
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
      setBuildingFormData((prevState) => {
        return {
          ...prevState,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          phone: user?.phone,
          address: user?.address,
          state: user?.state,
        };
      });
    }
  }, [user]);

  useEffect(() => {
    if (state) {
      setBuildingFormData((prevState) => {
        return { ...prevState, state };
      });
    }

    if (buildingFormData?.startDate) {
      setBuildingFormData((prevState) => {
        return {
          ...prevState,
          endDate: projectTime(buildingFormData?.startDate, "1", "y"),
        };
      });
    }

    if (gender) {
      setBuildingFormData((prevState) => {
        return {
          ...prevState,
          gender,
        };
      });
    }
  }, [state, buildingFormData?.startDate, gender]);

  useEffect(() => {
    const subBuildingFormData = new FormData();

    subBuildingFormData.append("email", buildingFormData?.email);
    subBuildingFormData.append("firstName", buildingFormData?.firstName);
    subBuildingFormData.append("lastName", buildingFormData?.lastName);
    subBuildingFormData.append("phone", buildingFormData?.phone);
    subBuildingFormData.append("address", buildingFormData?.address);
    subBuildingFormData.append("state", buildingFormData?.state);
    subBuildingFormData.append(
      "locationOfProperty",
      buildingFormData?.locationOfProperty
    );
    subBuildingFormData.append(
      "valueOfProperty",
      buildingFormData?.valueOfProperty
    );
    subBuildingFormData.append("startDate", buildingFormData?.startDate);
    subBuildingFormData.append("endDate", buildingFormData?.endDate);
    subBuildingFormData.append("occupation", buildingFormData?.occupation);
    subBuildingFormData.append("gender", buildingFormData?.gender);

    setBuildingFormDataFormData(subBuildingFormData);
  }, [buildingFormData]);

  console.log(buildingFormData, "Building");

  return (
    <>
      {modals.policyCreated && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              title="Your have successfully applied for an All Risks Insurance Policy!"
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
      <section className={classes.container} id="insurance-form">
        <div className={classes.header}>
          <h4>Building Insurance Policy Form</h4>
          <p>
            Comprehensive Protection for Your Property. Building Insurance
            Policy
          </p>
        </div>

        <form>
          <Input
            label="First Name"
            placeholder="Eg: John"
            value={buildingFormData?.firstName}
            name="firstName"
            onChange={(e) => inputChangeHandler(e, setBuildingFormData)}
            isRequired
          />
          <Input
            label="Last Name"
            placeholder="Eg: Doe"
            value={buildingFormData?.lastName}
            name="lastName"
            onChange={(e) => inputChangeHandler(e, setBuildingFormData)}
            isRequired
          />{" "}
          <Input
            label="Email"
            placeholder="Eg: abc@xyz.com"
            value={buildingFormData?.email}
            name="email"
            onChange={(e) => inputChangeHandler(e, setBuildingFormData)}
            isRequired
          />{" "}
          <Input
            label="Phone Number"
            placeholder="Eg: +123 45 6789"
            value={buildingFormData?.phone}
            name="phone"
            onChange={(e) => inputChangeHandler(e, setBuildingFormData)}
            isRequired
          />{" "}
          <Dropdown
            label="Gender"
            options={GENDERS.map((data) => capitalize(data) as string)}
            title="Select Gender"
            selected={gender || buildingFormData?.gender}
            setSelected={setGender}
            isRequired
          />
          <Input
            label="Occupation"
            placeholder="Eg: Student"
            value={buildingFormData?.occupation}
            name="occupation"
            onChange={(e) => inputChangeHandler(e, setBuildingFormData)}
            isRequired
          />
          <Input
            label="Address"
            placeholder="Eg: 10 Abc Close"
            value={buildingFormData?.address}
            name="address"
            onChange={(e) => inputChangeHandler(e, setBuildingFormData)}
            isRequired
          />{" "}
          <Input
            label="Location Of Property"
            placeholder="ABC Close"
            value={buildingFormData?.locationOfProperty}
            name="locationOfProperty"
            onChange={(e) => inputChangeHandler(e, setBuildingFormData)}
            isRequired
          />{" "}
          <Input
            label="Value Of Property"
            placeholder="200,000"
            type="number"
            value={buildingFormData?.valueOfProperty}
            name="valueOfProperty"
            onChange={(e) => inputChangeHandler(e, setBuildingFormData)}
            isRequired
          />{" "}
          <Dropdown
            label="State"
            options={states}
            title="Select"
            selected={state}
            setSelected={setState}
            isRequired
          />
          <Input
            label="Start Date"
            type="date"
            value={buildingFormData?.startDate}
            name="startDate"
            onChange={(e) => inputChangeHandler(e, setBuildingFormData)}
            // min={TODAY}
            isRequired
          />
          <Input
            label="End Date"
            type="date"
            value={buildingFormData?.endDate}
            name="endDate"
            readOnly
          />
          <div>
            <Button
              loading={requestState?.isLoading}
              disabled={!areAllValuesFilled(buildingFormData)}
              onClick={(e) => {
                e.preventDefault();
                buildiingFormSubmitHandler();
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default BuildingForm;
