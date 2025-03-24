import Image from "next/image";
import classes from "./ThirdPartyInsuranceForm.module.css";
import Input from "@/components/Input/Input";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import { states } from "@/utilities/states";
import {
  modalGenericType,
  requestType,
  thirdPartyInsuranceFormTypes,
} from "@/utilities/types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import moment from "moment";
import { carColors } from "@/utilities/motorInsuranceData";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import Loader from "@/components/Loader/Loader";
import { projectTime } from "@/helpers/projectTime";
import { Alert } from "@mui/material";

type ThirdPartyInsuranceFormTypes = {
  data: thirdPartyInsuranceFormTypes;
  setData: Dispatch<SetStateAction<thirdPartyInsuranceFormTypes>>;
  onSubmit: () => void;
  submitState: requestType;
  setSubmitState: Dispatch<SetStateAction<requestType>>;
};

const ThirdPartyInsuranceForm = ({
  data,
  setData,
  onSubmit,
  submitState,
  setSubmitState,
}: ThirdPartyInsuranceFormTypes) => {
  // States
  const [vehicleColor, setVehicleColor] = useState("");
  const [state, setState] = useState("");
  const [roadWorthiness, setRoadWorthiness] = useState("");
  const [title, setTitle] = useState("");
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });
  const [modals, setModals] = useState<modalGenericType>({
    insuranceCreated: false,
    payment: false,
    paymentSuccess: false,
  });

  // Hooks
  const { errorFlowFunction } = useError();

  // Requests
  const askNiidHandler = (regNumber: string) => {
    requestHandler({
      method: "POST",
      url: "/scrape/ask-niid",
      id: "ask-niid",
      data: { policyNumber: regNumber },
      state: requestState,
      setState: setRequestState,
      requestCleanup: false,
    });
  };

  // Utils
  const existingThirdPartyPolicies = requestState?.data?.policyData?.filter(
    (data: any) => data["type-of-cover"]?.toLowerCase() === "third party"
  );
  const todaysDate = moment().format("YYYY-MM-DD");

  // Effects
  useEffect(() => {
    if (existingThirdPartyPolicies?.length > 0) {
      const thirdPartyPolicy = existingThirdPartyPolicies[0];

      setData((prevState) => {
        return {
          ...prevState,

          startDate: moment(thirdPartyPolicy["valid-to"], "D MMMM YYYY").format(
            "YYYY-MM-DD"
          ),
          chasisNumber: thirdPartyPolicy["chassis-no"],
        };
      });
    }
  }, [requestState?.data]);

  useEffect(() => {
    if (data?.startDate) {
      const endDate = projectTime(data?.startDate, 1, "year");
      setData((prevState) => {
        return { ...prevState, endDate };
      });
    }
  }, [data?.startDate]);

  useEffect(() => {
    if (vehicleColor) {
      setData((prevState) => {
        return { ...prevState, vehicleColor };
      });
    }

    if (state) {
      setData((prevState) => {
        return { ...prevState, state };
      });
    }

    if (roadWorthiness) {
      setData((prevState) => {
        return { ...prevState, roadWorthiness };
      });
    }

    if (title) {
      setData((prevState) => {
        return { ...prevState, title };
      });
    }
  }, [vehicleColor, state, roadWorthiness, title]);

  useEffect(() => {
    if (submitState?.data && submitState?.id === "submit-form") {
      setModalTrue(setModals, "insuranceCreated");
    }
  }, [submitState?.data]);

  return (
    <>
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
              data={data as any}
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
              title="Your have successfully applied for a Third Party Motor Insurance Policy!"
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

      <section className={classes.container} id="insurance-form">
        <div className={classes.header}>
          <h4>Third Party Insurance Form</h4>
          <p>
            From Form to Coverage. Get Your Third Party Insurance in 5 Minutes
          </p>
        </div>

        <form>
          {requestState?.data && (
            <div className={classes.alert}>
              <Alert severity="warning">
                It appears you have an existing Third Party Policy. We can begin
                this renewal process!
              </Alert>
            </div>
          )}
          <Input
            label="Registration Number"
            placeholder="Eg: 12346"
            name="registrationNumber"
            value={data?.registrationNumber}
            onChange={(e) => inputChangeHandler(e, setData)}
            onBlur={() => {
              if (data?.registrationNumber) {
                askNiidHandler(data?.registrationNumber);
              }
            }}
            loading={requestState?.isLoading}
          />
          <Input
            label="Chassis Number"
            placeholder="Eg: 12346"
            name="chasisNumber"
            value={data?.chasisNumber}
            onChange={(e) => inputChangeHandler(e, setData)}
          />

          <Dropdown
            label="Vehicle Colour"
            options={carColors}
            title="Select"
            selected={vehicleColor}
            setSelected={setVehicleColor}
          />

          <Dropdown
            label="Do you require assistance with vehicle license and/or road worthiness"
            options={["Yes", "No"]}
            title="Select"
            selected={roadWorthiness}
            setSelected={setRoadWorthiness}
          />

          <Input
            label="Start Date"
            name="startDate"
            value={data?.startDate}
            onChange={(e) => inputChangeHandler(e, setData)}
            type="date"
            min={todaysDate}
          />

          <Input
            label="End Date"
            name="endDate"
            value={data?.endDate}
            onChange={(e) => inputChangeHandler(e, setData)}
            type="date"
            readOnly
          />

          <h4>Tell us About Yourself</h4>
          <Dropdown
            label="Title"
            options={["Mr.", "Mrs.", "Miss"]}
            title="Select"
            selected={title}
            setSelected={setTitle}
          />
          <Input
            label="First Name"
            placeholder="Eg: John"
            name="firstName"
            value={data?.firstName}
            onChange={(e) => inputChangeHandler(e, setData)}
          />
          <Input
            label="Last Name"
            placeholder="Eg: Doe"
            name="lastName"
            value={data?.lastName}
            onChange={(e) => inputChangeHandler(e, setData)}
          />
          <Input
            label="Email"
            placeholder="Eg: example@gmail.com"
            type="email"
            name="email"
            value={data?.email}
            onChange={(e) => inputChangeHandler(e, setData)}
          />
          <Input
            label="Phone Number"
            placeholder="+234 12 345 6789"
            name="phoneNumber"
            value={data?.phoneNumber}
            onChange={(e) => inputChangeHandler(e, setData)}
          />
          <Input
            label="Address"
            placeholder="No. 4, B Close, A State"
            name="address"
            value={data?.address}
            onChange={(e) => inputChangeHandler(e, setData)}
          />
          <Dropdown
            label="State"
            options={states}
            title="Select State"
            selected={state || data?.state}
            setSelected={setState}
          />

          <div>
            <Button
              disabled={!areAllValuesFilled(data)}
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              loading={submitState?.isLoading}
            >
              {requestState?.data ? "Renew" : "Submit"}
            </Button>
          </div>

          {requestState?.isLoading && (
            <div className={classes.loader}>
              <Loader />
              <p>
                Checking to see if you have an existing third party insurance
                policy...
              </p>
            </div>
          )}
        </form>
      </section>
    </>
  );
};

export default ThirdPartyInsuranceForm;
