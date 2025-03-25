import Image from "next/image";
import classes from "./ThirdPartyInsuranceForm.module.css";
import Input from "@/components/Input/Input";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import { states } from "@/utilities/states";
import {
  modalGenericType,
  requestType,
  thirdPartyInsuranceFormType,
} from "@/utilities/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { requestHandler } from "@/helpers/requestHandler";
import moment from "moment";
import { carColors } from "@/utilities/motorInsuranceData";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import Loader from "@/components/Loader/Loader";
import { projectTime } from "@/helpers/projectTime";
import { Alert, capitalize } from "@mui/material";
import { GENDERS } from "@/utilities/constants";
import { useCars } from "@/hooks/usePolicies";

type ThirdPartyInsuranceFormTypes = {
  data: thirdPartyInsuranceFormType;
  setData: Dispatch<SetStateAction<thirdPartyInsuranceFormType>>;
  onSubmit: () => void;
  submitState: requestType;
  setSubmitState: Dispatch<SetStateAction<requestType>>;
};

const ThirdPartyInsuranceForm = ({
  data,
  setData,
  onSubmit,
  submitState,
}: ThirdPartyInsuranceFormTypes) => {
  // Requests
  const { isLoading, data: carData } = useCars();

  // States
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
  const [gender, setGender] = useState("");
  const [makeOfVehicle, setMakeOfVehicle] = useState("");
  const [modelOfVehicle, setModelOfVehidle] = useState("");
  const [yearOfMake, setYearOfMake] = useState("");
  const [carManufacturers, setCarManufacturers] = useState([]);
  const [carModels, setCarModels] = useState([]);

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

  function getCarManufacturers(carsData: any) {
    const manufacturersMap: any = {};

    carsData.forEach((car: any) => {
      const { make, model } = car;
      if (!manufacturersMap[make]) {
        manufacturersMap[make] = new Set();
      }
      manufacturersMap[make].add(model);
    });

    const manufacturersArray = Object.entries(manufacturersMap).map(
      ([make, modelsSet]) => ({
        make,
        models: Array.from(modelsSet as any),
      })
    );

    return manufacturersArray;
  }

  const currentYear = Number(moment().format("YYYY"));

  let years = [];

  for (let i = currentYear; i >= 1980; i--) {
    years.push(String(i));
  }

  // Effects
  useEffect(() => {
    if (carData?.data) {
      setCarManufacturers(
        getCarManufacturers(carData?.data)?.map((data) =>
          capitalize(data?.make)
        ) as any
      );
    }
  }, [carData?.data]);

  useEffect(() => {
    if (carData?.data) {
      const newCarModels = getCarManufacturers(carData?.data)
        ?.find((car) => {
          return car?.make?.toLowerCase() === makeOfVehicle?.toLowerCase();
        })
        ?.models?.map((data) => capitalize(data as string));

      setCarModels(newCarModels as any);
    }
  }, [makeOfVehicle]);

  useEffect(() => {
    if (existingThirdPartyPolicies?.length > 0) {
      const thirdPartyPolicy = existingThirdPartyPolicies[0];

      setData((prevState: thirdPartyInsuranceFormType) => {
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
      setData((prevState: thirdPartyInsuranceFormType) => {
        return { ...prevState, endDate };
      });
    }
  }, [data?.startDate]);

  useEffect(() => {
    if (state) {
      setData((prevState: thirdPartyInsuranceFormType) => {
        return { ...prevState, state };
      });
    }

    if (roadWorthiness) {
      setData((prevState: thirdPartyInsuranceFormType) => {
        return { ...prevState, roadWorthiness };
      });
    }

    if (title) {
      setData((prevState: thirdPartyInsuranceFormType) => {
        return { ...prevState, title };
      });
    }

    if (gender) {
      setData((prevState: thirdPartyInsuranceFormType) => {
        return { ...prevState, gender };
      });
    }

    if (makeOfVehicle) {
      setData((prevState) => {
        return { ...prevState, makeOfVehicle };
      });
    }

    if (modelOfVehicle) {
      setData((prevState) => {
        return { ...prevState, modelOfVehicle };
      });
    }

    if (yearOfMake) {
      setData((prevState) => {
        return { ...prevState, yearOfMake };
      });
    }
  }, [
    state,
    roadWorthiness,
    title,
    gender,
    makeOfVehicle,
    modelOfVehicle,
    yearOfMake,
  ]);

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
            // onBlur={() => {
            //   if (data?.registrationNumber) {
            //     askNiidHandler(data?.registrationNumber);
            //   }
            // }}
            loading={requestState?.isLoading}
            isRequired
          />
          <Input
            label="Chassis Number"
            placeholder="Eg: 12346"
            name="chasisNumber"
            value={data?.chasisNumber}
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />

          <Dropdown
            label="Make of Vehicle"
            options={carManufacturers}
            selected={makeOfVehicle}
            setSelected={setMakeOfVehicle}
            isLoading={isLoading}
            isRequired
          />
          <Dropdown
            label="Year of make"
            options={years}
            isRequired
            selected={yearOfMake}
            setSelected={setYearOfMake}
          />

          <Dropdown
            label="Model of Vehicle"
            options={(carModels as any) || []}
            isRequired
            selected={modelOfVehicle}
            setSelected={setModelOfVehidle}
          />

          <Input
            label="Start Date"
            name="startDate"
            value={data?.startDate}
            onChange={(e) => inputChangeHandler(e, setData)}
            type="date"
            // min={todaysDate}
            isRequired
          />

          <Input
            label="End Date"
            name="endDate"
            value={data?.endDate}
            onChange={(e) => inputChangeHandler(e, setData)}
            type="date"
            readOnly
            isRequired
          />

          <Dropdown
            label="Do you require assistance with vehicle license and/or road worthiness"
            options={["Yes", "No"]}
            title="Select"
            selected={roadWorthiness}
            setSelected={setRoadWorthiness}
            isRequired
          />

          <h4>Tell us About Yourself</h4>
          <Dropdown
            label="Title"
            options={["Mr.", "Mrs.", "Miss"]}
            title="Select"
            selected={title}
            setSelected={setTitle}
            isRequired
          />
          <Input
            label="First Name"
            placeholder="Eg: John"
            name="firstName"
            value={data?.firstName}
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />
          <Input
            label="Last Name"
            placeholder="Eg: Doe"
            name="lastName"
            value={data?.lastName}
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />
          <Input
            label="Email"
            placeholder="Eg: example@gmail.com"
            type="email"
            name="email"
            value={data?.email}
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />
          <Input
            label="Phone Number"
            placeholder="+234 12 345 6789"
            name="phone"
            value={data?.phone}
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />

          <Dropdown
            label="Gender"
            options={GENDERS.map((data) => capitalize(data) as string)}
            title="Select Gender"
            selected={gender}
            setSelected={setGender}
            isRequired
          />

          <Input
            label="Occupation"
            placeholder="Eg: Student"
            value={data?.occupation}
            name="occupation"
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />

          <Input
            label="Address"
            placeholder="No. 4, B Close, A State"
            name="address"
            value={data?.address}
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />
          <Dropdown
            label="State of Residence"
            options={states}
            title="Select State"
            selected={state || data?.state}
            setSelected={setState}
            isRequired
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
