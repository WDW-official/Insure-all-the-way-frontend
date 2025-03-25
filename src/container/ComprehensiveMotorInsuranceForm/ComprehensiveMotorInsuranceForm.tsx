import Button from "@/components/Button/Button";
import Dropdown from "@/components/Dropdown/Dropdown";
import Input from "@/components/Input/Input";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import classes from "./ComprehensiveMotorInsuranceForm.module.css";
import { states } from "@/utilities/states";
import { comprehensiveeFormDataTypes, requestType } from "@/utilities/types";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import moment from "moment";
import { GENDERS, TODAY } from "@/utilities/constants";
import { formatCurrency } from "@/helpers/formatAmount";
import { useCars } from "@/hooks/usePolicies";
import { capitalize } from "@/helpers/capitalize";

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
  // Requests
  const { isLoading, data: carData } = useCars();

  // States
  const [coverPeriod, setCoverPeriod] = useState("");
  const [state, setState] = useState("");
  const [makeOfVehicle, setMakeOfVehicle] = useState("");
  const [modelOfVehicle, setModelOfVehidle] = useState("");
  const [yearOfMake, setYearOfMake] = useState("");
  const [carManufacturers, setCarManufacturers] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [gender, setGender] = useState("");

  // Utils
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

  let years = [];
  const currentYear = Number(moment().format("YYYY"));

  for (let i = currentYear; i >= 1980; i--) {
    years.push(String(i));
  }

  // Effects
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
