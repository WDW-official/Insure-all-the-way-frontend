import Button from "@/components/Button/Button";
import Dropdown from "@/components/Dropdown/Dropdown";
import Input from "@/components/Input/Input";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import classes from "./ComprehensiveMotorInsuranceForm.module.css";
import { states } from "@/utilities/states";
import { comprehensiveeFormDataTypes, requestType } from "@/utilities/types";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import moment from "moment";
import { GENDERS, TODAY } from "@/utilities/constants";
import { formatCurrency } from "@/helpers/formatAmount";
import {
  useCarMakes,
  useCarModels,
  useCars,
  useCarYearsByMakeAndModel,
} from "@/hooks/usePolicies";
import { capitalize, capitalizeEachWord } from "@/helpers/capitalize";
import { mutate } from "swr";

type ComprehensiveMotorInsuranceFormTypes = {
  data: comprehensiveeFormDataTypes;
  setData: Dispatch<SetStateAction<comprehensiveeFormDataTypes>>;
  onSubmit: () => void;
  requestState: requestType;
};

const ComprehensiveMotorInsuranceForm = ({
  data,
  setData,
  onSubmit,
  requestState,
}: ComprehensiveMotorInsuranceFormTypes) => {
  // States
  const [coverPeriod, setCoverPeriod] = useState("");
  const [state, setState] = useState("");
  const [makeOfVehicle, setMakeOfVehicle] = useState("");
  const [modelOfVehicle, setModelOfVehidle] = useState("");
  const [yearOfMake, setYearOfMake] = useState("");
  const [gender, setGender] = useState("");

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
    if (requestState?.data && requestState?.id === "submit-form") {
      setCoverPeriod("");
      setState("");
      setMakeOfVehicle("");
      setModelOfVehidle("");
      setYearOfMake("");
      setGender("");
    }
  }, [requestState?.data]);

  useEffect(() => {
    if (coverPeriod || state || data?.vehicleValue) {
      const period = coverPeriod === "6 Months" ? 6 : 12;
      const endDate = String(moment().add(period, "M").format("YYYY-MM-DD"));
      const startDate = TODAY;

      const premiumPercentage = coverPeriod === "6 Months" ? 0.025 : 0.05;
      const premium = String(Number(data?.vehicleValue) * premiumPercentage);

      setData((prevState) => {
        return {
          ...prevState,
          startDate: startDate as string,
          endDate: endDate as string,
          coverPeriod,
          state,
          premium,
        };
      });
    }
  }, [coverPeriod, state, data.vehicleValue]);

  useEffect(() => {
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

    if (gender) {
      setData((prevState) => {
        return { ...prevState, gender };
      });
    }
  }, [makeOfVehicle, modelOfVehicle, yearOfMake, gender]);

  return (
    <section className={classes.container} id="insurance-form">
      <div className={classes.header}>
        <h4>Comprehensive Motor Insurance Form</h4>
        <p>
          Please ensure that all your information is correctly filled in,
          failure to do so may render your policy void.
        </p>
      </div>

      <form>
        <Input
          label="First Name"
          placeholder="Eg: John"
          value={data?.firstName}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="firstName"
          isRequired
        />
        <Input
          label="Last Name"
          placeholder="Eg: Doe"
          value={data?.lastName}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="lastName"
          isRequired
        />
        <Input
          label="Email"
          placeholder="Eg: example@gmail.com"
          type="email"
          value={data?.email}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="email"
          isRequired
        />
        <Input
          label="Phone Number"
          placeholder="+234 12 345 6789"
          value={data?.phone}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="phone"
          isRequired
        />
        <Dropdown
          label="Gender"
          options={GENDERS.map((data) => capitalize(data) as string)}
          title="Select Gender"
          selected={gender || data?.gender}
          setSelected={setGender}
          isRequired
        />
        <Input
          label="Address"
          placeholder="Eg: ABC Close"
          value={data?.address}
          name="address"
          onChange={(e) => inputChangeHandler(e, setData)}
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
        <Dropdown
          label="State of Residence"
          options={states}
          title="Select State"
          selected={state || data?.state}
          setSelected={setState}
          isRequired
        />
        <Input
          label="Registration Number"
          placeholder="Eg: 12346"
          value={data?.registrationNumber}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="registrationNumber"
          isRequired
        />
        <Input
          label="Chassis Number"
          placeholder="Eg: 12346"
          value={data?.chassisNumber}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="chassisNumber"
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

        <Dropdown
          label="Cover Period"
          options={["6 Months", "1 Year"]}
          title="Select"
          selected={coverPeriod || data?.coverPeriod}
          setSelected={setCoverPeriod}
          isRequired
        />

        <Input
          label="Vehicle Value"
          placeholder="Eg: 200,000"
          type="number"
          value={data?.vehicleValue}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="vehicleValue"
          isRequired
        />

        <Input
          label="Premium"
          placeholder="Eg: 200,000"
          readOnly
          value={`₦${formatCurrency(data?.premium)}`}
        />

        <div>
          <Button
            disabled={
              !data?.firstName ||
              !data?.lastName ||
              !data?.email ||
              !data?.phone ||
              !data?.state ||
              !data?.registrationNumber ||
              !data?.coverPeriod ||
              !data?.vehicleValue ||
              !data?.premium ||
              !data?.makeOfVehicle ||
              !data?.yearOfMake ||
              !data?.modelOfVehicle ||
              !data?.address
            }
            loading={requestState?.isLoading}
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ComprehensiveMotorInsuranceForm;
