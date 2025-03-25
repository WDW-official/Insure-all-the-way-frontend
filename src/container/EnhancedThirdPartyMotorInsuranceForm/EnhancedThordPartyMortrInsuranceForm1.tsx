import Dropdown from "@/components/Dropdown/Dropdown";
import classes from "./EnhancedThirdPartyMotorInsuranceForm.module.css";
import Input from "@/components/Input/Input";
import { carColors, vehicleTypes } from "@/utilities/motorInsuranceData";
import { enhancedThirdPartyInsuranceFormTypes } from "@/utilities/types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useCars } from "@/hooks/usePolicies";
import { capitalize } from "@/helpers/capitalize";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { projectTime } from "@/helpers/projectTime";

type EnhancedThordPartyMortrInsuranceForm1Types = {
  data: enhancedThirdPartyInsuranceFormTypes;
  setData: Dispatch<SetStateAction<enhancedThirdPartyInsuranceFormTypes>>;
};

const EnhancedThordPartyMortrInsuranceForm1 = ({
  data,
  setData,
}: EnhancedThordPartyMortrInsuranceForm1Types) => {
  // Requests
  const { isLoading, data: carData } = useCars();

  // States
  const [makeOfVehicle, setMakeOfVehicle] = useState("");
  const [modelOfVehicle, setModelOfVehidle] = useState("");
  const [yearOfMake, setYearOfMake] = useState("");
  const [carManufacturers, setCarManufacturers] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [color, setColor] = useState("");
  const [vehicleType, setVehicleType] = useState("");

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

  const currentYear = Number(moment().format("YYYY"));

  let years = [];

  for (let i = currentYear; i >= 1980; i--) {
    years.push(String(i));
  }

  const today = moment().format("YYYY-MM-DD");

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

    if (vehicleType) {
      setData((prevState) => {
        return { ...prevState, vehicleType };
      });
    }

    if (color) {
      setData((prevState) => {
        return { ...prevState, color };
      });
    }
  }, [makeOfVehicle, modelOfVehicle, yearOfMake, vehicleType, color]);

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
    if (data?.startDate) {
      const endDate = projectTime(data?.startDate, 1, "year");
      setData((prevState) => {
        return { ...prevState, endDate };
      });
    }
  }, [data?.startDate]);

  return (
    <form>
      <Dropdown
        label="Make of Vehicle"
        options={carManufacturers}
        selected={makeOfVehicle || data?.makeOfVehicle}
        setSelected={setMakeOfVehicle}
        isLoading={isLoading}
        isRequired
      />
      <Dropdown
        label="Year of make"
        options={years}
        isRequired
        selected={yearOfMake || data?.yearOfMake}
        setSelected={setYearOfMake}
      />

      <Dropdown
        label="Model of Vehicle"
        options={(carModels as any) || []}
        isRequired
        selected={modelOfVehicle || data?.modelOfVehicle}
        setSelected={setModelOfVehidle}
      />
      <Input
        label="Registration Number"
        isRequired
        value={data?.registrationNumber}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="registrationNumber"
      />
      <Input
        label="Start Date"
        isRequired
        type="date"
        // min={today}
        value={data?.startDate}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="startDate"
      />
      <Input
        label="End Date"
        isRequired
        type="date"
        value={data?.endDate}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="endDate"
        readOnly
      />

      <Input
        label="Engine Number"
        isRequired
        value={data?.engineNumber}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="engineNumber"
      />
      <Input
        label="Chassis Number"
        isRequired
        value={data?.chasisNumber}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="chasisNumber"
      />

      <Dropdown
        label="Vehicle Type"
        options={vehicleTypes}
        isRequired
        selected={vehicleType || data?.vehicleType}
        setSelected={setVehicleType}
      />
    </form>
  );
};

export default EnhancedThordPartyMortrInsuranceForm1;
