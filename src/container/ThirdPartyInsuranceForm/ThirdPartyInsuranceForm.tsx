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
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { requestHandler } from "@/helpers/requestHandler";
import moment from "moment";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import Loader from "@/components/Loader/Loader";
import { projectTime } from "@/helpers/projectTime";
import { Alert, cardClasses } from "@mui/material";
import { GENDERS, TODAY } from "@/utilities/constants";
import {
  useCarMakes,
  useCarModels,
  useCars,
  useCarYearsByMakeAndModel,
} from "@/hooks/usePolicies";
import { mutate } from "swr";
import { capitalize, capitalizeEachWord } from "@/helpers/capitalize";

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

  // Requests
  const { isLoading: carMakesIsLoading, data: carMakesData } = useCarMakes();
  const { isLoading: modelsIsLoading, data: carModelsData } = useCarModels(
    makeOfVehicle as string
  );
  const { isLoading: yearsIsLoading, data: yearsData } =
    useCarYearsByMakeAndModel(
      makeOfVehicle as string,
      modelOfVehicle as string
    );

  // Memos
  const carMakes = useMemo(() => {
    return carMakesData?.data?.makes?.map((data: string) =>
      capitalizeEachWord(data)
    );
  }, [carMakesData]);

  const carModels = useMemo(() => {
    return carModelsData?.data?.models?.map((data: string) => capitalize(data));
  }, [carModelsData]);

  const carYears = useMemo(() => {
    return yearsData?.data?.years;
  }, [yearsData]);

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

  // Effects
  useEffect(() => {
    if (makeOfVehicle) {
      mutate(`/externals/cars/models/${makeOfVehicle}`);
    }

    if (makeOfVehicle && modelOfVehicle) {
      mutate(`/externals/cars/models/${makeOfVehicle}/${modelOfVehicle}`);
    }
  }, [makeOfVehicle]);

  useEffect(() => {
    if (submitState?.data && submitState?.id === "submit-form") {
      setGender("");
      setMakeOfVehicle("");
      setModelOfVehidle("");
      setYearOfMake("");
      setState("");
      setRoadWorthiness("");
      setTitle("");
    }
  }, [submitState?.data]);

  useEffect(() => {
    const thirdPartyPolicy = requestState?.data?.policyData;

    if (
      thirdPartyPolicy?.type_of_cover?.toLowerCase().includes("third party")
    ) {
      setData((prevState: thirdPartyInsuranceFormType) => {
        return {
          ...prevState,
          startDate: moment(
            thirdPartyPolicy["issue_date"],
            "D MMMM YYYY"
          ).format("YYYY-MM-DD"),
          chasisNumber: thirdPartyPolicy["chassis_number"],
          makeOfVehicle: thirdPartyPolicy["vehicle_make"],
          modelOfVehicle: thirdPartyPolicy["vehicle_model"],
        };
      });

      setMakeOfVehicle(thirdPartyPolicy["vehicle_make"]);
      setModelOfVehidle(thirdPartyPolicy["vehicle_model"]);
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
            onBlur={() => {
              if (data?.registrationNumber) {
                askNiidHandler(data?.registrationNumber);
              }
            }}
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
            options={carMakes}
            selected={makeOfVehicle}
            setSelected={setMakeOfVehicle}
            isLoading={carMakesIsLoading}
            isRequired
          />

          <Dropdown
            label="Model of Vehicle"
            options={(carModels as any) || []}
            isRequired
            isLoading={modelsIsLoading}
            selected={modelOfVehicle}
            setSelected={setModelOfVehidle}
            disabled={!makeOfVehicle}
          />

          <Dropdown
            label="Year of make"
            options={carYears}
            isLoading={yearsIsLoading}
            isRequired
            selected={yearOfMake}
            setSelected={setYearOfMake}
            disabled={!makeOfVehicle || !modelOfVehicle}
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
