import Dropdown from "@/components/Dropdown/Dropdown";
import classes from "./EnhancedThirdPartyMotorInsuranceForm.module.css";
import Input from "@/components/Input/Input";
import { carColors, vehicleTypes } from "@/utilities/motorInsuranceData";
import {
  enhancedThirdPartyInsuranceFormTypes,
  requestType,
} from "@/utilities/types";
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
import { requestHandler } from "@/helpers/requestHandler";
import { Alert } from "@mui/material";
import Loader from "@/components/Loader/Loader";
import FileUploadInput from "@/components/FileUploadInput/FileUploadInput";

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
  const [vehicleLicense, setVehicleLicense] = useState<File[]>([]);
  const [roadWorthinessFile, setRoadWorthinessFile] = useState<File[]>([]);
  const [roadWorthiness, setRoadWorthiness] = useState("");
  const [askNiidRequestState, setAskNiidRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

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

  const askNiidHandler = (regNumber: string) => {
    requestHandler({
      method: "POST",
      url: "/scrape/ask-niid",
      id: "ask-niid",
      data: { policyNumber: regNumber },
      state: askNiidRequestState,
      setState: setAskNiidRequestState,
      requestCleanup: false,
      errorFunction(err) {
        console.log(err, "Error");
      },
    });
  };

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
    const thirdPartyPolicy = askNiidRequestState?.data?.policyData;

    if (
      thirdPartyPolicy?.type_of_cover?.toLowerCase().includes("third party")
    ) {
      setData((prevState: enhancedThirdPartyInsuranceFormTypes) => {
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
  }, [askNiidRequestState?.data]);

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

    if (roadWorthiness) {
      setData((prevState) => {
        return { ...prevState, roadWorthiness };
      });
    }

    if (vehicleLicense?.length) {
      setData((prevState) => {
        return { ...prevState, vehicleLicense: vehicleLicense[0] };
      });
    }

    if (roadWorthinessFile?.length) {
      setData((prevState) => {
        return { ...prevState, roadWorthinessFile: roadWorthinessFile[0] };
      });
    }
  }, [
    makeOfVehicle,
    modelOfVehicle,
    yearOfMake,
    vehicleType,
    color,
    vehicleLicense,
    roadWorthinessFile,
    roadWorthiness,
  ]);

  useEffect(() => {
    if (data?.startDate) {
      const endDate = projectTime(data?.startDate, 1, "year");
      setData((prevState) => {
        return { ...prevState, endDate };
      });
    }
  }, [data?.startDate]);

  return (
    <form className={classes.form}>
      <Input
        label="Registration Number"
        isRequired
        value={data?.registrationNumber}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="registrationNumber"
        onBlur={() => {
          if (data?.registrationNumber) {
            askNiidHandler(data?.registrationNumber);
          }
        }}
        loading={askNiidRequestState?.isLoading}
      />

      <h4>Kindly Confirm Your Vehicle & Policy Details</h4>

      {askNiidRequestState?.isLoading ? (
        <Loader />
      ) : (
        <>
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

          <Dropdown
            label="Do you require assistance with vehicle license and/or road worthiness"
            options={["Yes", "No"]}
            title="Select"
            selected={roadWorthiness || data?.roadWorthiness}
            setSelected={setRoadWorthiness}
            isRequired
          />

          {data?.roadWorthiness === "Yes" && (
            <>
              <h4>Upload Vehicle License and Road Worthiness</h4>
              <FileUploadInput
                title="Upload Vehicle License"
                files={vehicleLicense}
                setFiles={setVehicleLicense}
                id="vehicleLicense"
                accept=".pdf"
              />

              <FileUploadInput
                title="Upload Road Worthiness Document"
                files={roadWorthinessFile}
                setFiles={setRoadWorthinessFile}
                id="roadWorthinessFile"
                accept=".pdf"
              />
            </>
          )}
        </>
      )}
    </form>
  );
};

export default EnhancedThordPartyMortrInsuranceForm1;
