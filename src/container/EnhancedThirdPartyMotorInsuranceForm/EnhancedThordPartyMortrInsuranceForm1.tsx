import Dropdown from "@/components/Dropdown/Dropdown";
import classes from "./EnhancedThirdPartyMotorInsuranceForm.module.css";
import Input from "@/components/Input/Input";
import { carColors, vehicleTypes } from "@/utilities/motorInsuranceData";
import { enhancedThirdPartyInsuranceFormTypes } from "@/utilities/types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
  useCarMakes,
  useCarModels,
  useCarYearsByMakeAndModel,
} from "@/hooks/usePolicies";
import { capitalize, capitalizeEachWord } from "@/helpers/capitalize";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { projectTime } from "@/helpers/projectTime";
import { mutate } from "swr";

type EnhancedThordPartyMortrInsuranceForm1Types = {
  data: enhancedThirdPartyInsuranceFormTypes;
  setData: Dispatch<SetStateAction<enhancedThirdPartyInsuranceFormTypes>>;
};

const EnhancedThordPartyMortrInsuranceForm1 = ({
  data,
  setData,
}: EnhancedThordPartyMortrInsuranceForm1Types) => {
  // States
  const [makeOfVehicle, setMakeOfVehicle] = useState("");
  const [modelOfVehicle, setModelOfVehidle] = useState("");
  const [yearOfMake, setYearOfMake] = useState("");
  const [color, setColor] = useState("");
  const [vehicleType, setVehicleType] = useState("");

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

  // Utils

  const today = moment().format("YYYY-MM-DD");

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
