"use client";

import Input from "@/components/Input/Input";
import classes from "../IndividualAndFamilyHmoForm/IndividualAndFamilyHmoForm.module.css";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import { states } from "@/utilities/states";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  allRiskDataTypes,
  modalGenericType,
  requestType,
} from "@/utilities/types";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";
import { projectTime } from "@/helpers/projectTime";
import { TODAY } from "@/utilities/constants";
import { requestHandler } from "@/helpers/requestHandler";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import useError from "@/hooks/useError";
import Modal from "@/components/Modal/Modal";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";

const AllRiskForm = () => {
  // States
  const [allRiskFormData, setAllRiskFormData] = useState<allRiskDataTypes>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    state: "",
    deviceType: "",
    valueOfDevice: "",
    quantityOfDevice: "",
    premium: "",
    startDate: "",
    endDate: "",
  });
  const [state, setState] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });
  const [modals, setModals] = useState<modalGenericType>({
    policyCreated: false,
  });

  // FormData
  const [allRiskFormDataFOrmData, setAllRiskFormDataFormData] = useState(
    new FormData()
  );

  // Hooks
  const { errorFlowFunction } = useError();

  // Context
  const { user } = useContext(AuthContext);

  // Utils
  const allRiskFormSubmitHandler = () => {
    requestHandler({
      url: "/policies/policy/property-insurance/all-risk",
      method: "POST",
      isMultipart: true,
      data: allRiskFormDataFOrmData,
      state: requestState,
      setState: setRequestState,
      successFunction() {
        setModalTrue(setModals, "policyCreated");
        setAllRiskFormData((prevstate) => {
          return {
            ...prevstate,
            deviceType: "",
            valueOfDevice: "",
            quantityOfDevice: "",
            premium: "",
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
      setAllRiskFormData((prevState) => {
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
    if (allRiskFormData?.valueOfDevice || allRiskFormData?.quantityOfDevice) {
      const itemBasePrice = Number(allRiskFormData?.valueOfDevice);
      const premium =
        itemBasePrice * 0.03 * (Number(allRiskFormData?.quantityOfDevice) || 1);

      setAllRiskFormData((prevState) => {
        return { ...prevState, premium: String(premium) };
      });
    }

    if (allRiskFormData?.startDate) {
      setAllRiskFormData((prevState) => {
        return {
          ...prevState,
          endDate: projectTime(allRiskFormData?.startDate, "1", "y"),
        };
      });
    }

    if (deviceType) {
      setAllRiskFormData((prevState) => {
        return { ...prevState, deviceType };
      });
    }

    if (state) {
      setAllRiskFormData((prevState) => {
        return { ...prevState, state };
      });
    }
  }, [
    allRiskFormData?.valueOfDevice,
    allRiskFormData?.quantityOfDevice,
    allRiskFormData?.startDate,
    deviceType,
    state,
  ]);

  useEffect(() => {
    const subAllRiskFormData = new FormData();

    subAllRiskFormData.append("email", allRiskFormData?.email);
    subAllRiskFormData.append("firstName", allRiskFormData?.firstName);
    subAllRiskFormData.append("lastName", allRiskFormData?.lastName);
    subAllRiskFormData.append("phone", allRiskFormData?.phone);
    subAllRiskFormData.append("address", allRiskFormData?.address);
    subAllRiskFormData.append("state", allRiskFormData?.state);
    subAllRiskFormData.append("deviceType", allRiskFormData?.deviceType);
    subAllRiskFormData.append("valueOfDevice", allRiskFormData?.valueOfDevice);
    subAllRiskFormData.append("quantityOfDevice", allRiskFormData?.email);
    subAllRiskFormData.append("premium", allRiskFormData?.premium);
    subAllRiskFormData.append("startDate", allRiskFormData?.startDate);
    subAllRiskFormData.append("endDate", allRiskFormData?.endDate);

    setAllRiskFormDataFormData(subAllRiskFormData);
  }, [allRiskFormData]);

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
          <h4>All Risks Policy Form</h4>
          <p>
            Comprehensive Protection for Your Property. Building Insurance
            Policy
          </p>
        </div>

        <form>
          <Input
            label="First Name"
            placeholder="Eg: John"
            value={allRiskFormData?.firstName}
            name="firstName"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
          />
          <Input
            label="Last Name"
            placeholder="Eg: Doe"
            value={allRiskFormData?.lastName}
            name="lastName"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
          />
          <Input
            label="Email"
            placeholder="Eg: abc@xyz.com"
            value={allRiskFormData?.email}
            name="email"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
          />{" "}
          <Input
            label="Phone Number"
            placeholder="Eg: +123 45 6789"
            value={allRiskFormData?.phone}
            name="phone"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
          />{" "}
          <Input
            label="Address"
            placeholder="Eg: 10 Abc Close"
            value={allRiskFormData?.address}
            name="address"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
          />{" "}
          <Dropdown
            label="State"
            options={states}
            title="Select"
            selected={state || allRiskFormData?.state}
            setSelected={setState}
          />
          <Dropdown
            label="What type of device would you like to insure"
            title="Select"
            options={["Laptop", "Phone"]}
            selected={deviceType}
            setSelected={setDeviceType}
          />{" "}
          <Input
            label="Value of the device"
            placeholder="200,000"
            type="number"
            value={allRiskFormData?.valueOfDevice}
            name="valueOfDevice"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
          />
          <Input
            label="Quantity of the device"
            placeholder="10"
            type="number"
            value={allRiskFormData?.quantityOfDevice}
            name="quantityOfDevice"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
          />
          <Input
            label="Premium"
            placeholder="10"
            type="number"
            readOnly
            value={allRiskFormData?.premium}
          />
          <Input
            label="Start Date"
            type="date"
            value={allRiskFormData?.startDate}
            name="startDate"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
            min={TODAY}
          />
          <Input
            label="End Date"
            type="date"
            value={allRiskFormData?.endDate}
            name="endDate"
            readOnly
          />
          <div>
            <Button
              disabled={!areAllValuesFilled(allRiskFormData)}
              loading={requestState?.isLoading}
              onClick={(e) => {
                e.preventDefault();
                allRiskFormSubmitHandler();
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

export default AllRiskForm;
