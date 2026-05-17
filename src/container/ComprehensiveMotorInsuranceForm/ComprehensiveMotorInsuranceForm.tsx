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
import classes from "../ThirdPartyInsuranceForm/ThirdPartyInsuranceForm.module.css";
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
import { requestHandler } from "@/helpers/requestHandler";
import { Alert } from "@mui/material";
import FileUploadInput from "@/components/FileUploadInput/FileUploadInput";
import Loader from "@/components/Loader/Loader";
import Image from "next/image";
import useError from "@/hooks/useError";

type ComprehensiveMotorInsuranceFormTypes = {
  data: comprehensiveeFormDataTypes;
  setData: Dispatch<SetStateAction<comprehensiveeFormDataTypes>>;
  onSubmit: () => void;
  requestState: requestType;
};

type VehicleMakeOption = {
  name: string;
  code: string;
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
  const [askNiidRequestState, setAskNiidRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });
  const [vehicleLicense, setVehicleLicense] = useState<File[]>([]);
  const [roadWorthinessFile, setRoadWorthinessFile] = useState<File[]>([]);
  const [roadWorthiness, setRoadWorthiness] = useState("");

  // Hooks
  const { errorFlowFunction } = useError();

  // Requests
  const { isLoading: carMakesIsLoading, data: carMakesData } = useCarMakes();
  const makeOptions = useMemo<VehicleMakeOption[]>(
    () => carMakesData?.data?.makeOptions || [],
    [carMakesData]
  );
  const selectedMakeCode = useMemo(() => {
    if (!makeOfVehicle) {
      return "";
    }

    const selectedLabel = makeOfVehicle.trim().toLowerCase();
    const selected = makeOptions.find(
      (option) =>
        capitalizeEachWord(option.name).trim().toLowerCase() === selectedLabel
    );

    return selected?.code || "";
  }, [makeOfVehicle, makeOptions]);
  const makeIdentifier = selectedMakeCode || makeOfVehicle;
  const { isLoading: modelsIsLoading, data: carModelsData } = useCarModels(
    makeIdentifier as string
  );
  const { isLoading: yearsIsLoading, data: yearsData } =
    useCarYearsByMakeAndModel(
      makeIdentifier as string,
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
        errorFlowFunction(err);
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

  // Effects
  useEffect(() => {
    if (makeIdentifier) {
      mutate(`/externals/cars/models/${makeIdentifier}`);
    }

    if (makeIdentifier && modelOfVehicle) {
      mutate(`/externals/cars/models/${makeIdentifier}/${modelOfVehicle}`);
    }
  }, [makeIdentifier, modelOfVehicle]);

  useEffect(() => {
    const thirdPartyPolicy = askNiidRequestState?.data?.policyData;

    if (
      thirdPartyPolicy?.type_of_cover?.toLowerCase().includes("comprehensive")
    ) {
      setData((prevState: comprehensiveeFormDataTypes) => {
        return {
          ...prevState,
          startDate: moment(
            thirdPartyPolicy["issue_date"],
            "D MMMM YYYY"
          ).format("YYYY-MM-DD"),
          chassisNumber: thirdPartyPolicy["chassis_number"],
          makeOfVehicle: thirdPartyPolicy["vehicle_make"],
          modelOfVehicle: thirdPartyPolicy["vehicle_model"],
        };
      });

      setMakeOfVehicle(thirdPartyPolicy["vehicle_make"]);
      setModelOfVehidle(thirdPartyPolicy["vehicle_model"]);
    }
  }, [askNiidRequestState?.data]);

  useEffect(() => {
    if (requestState?.data && requestState?.id === "submit-form") {
      setCoverPeriod("");
      setState("");
      setMakeOfVehicle("");
      setModelOfVehidle("");
      setYearOfMake("");
      setGender("");
      setRoadWorthinessFile([]);
      setVehicleLicense([]);
      setRoadWorthiness("");
    }
  }, [requestState?.data]);

  useEffect(() => {
    if (coverPeriod || data?.vehicleValue) {
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

    if (vehicleLicense) {
      setData((prevState) => {
        return { ...prevState, vehicleLicense: vehicleLicense[0] };
      });
    }

    if (roadWorthinessFile) {
      setData((prevState) => {
        return { ...prevState, roadWorthinessFile: roadWorthinessFile[0] };
      });
    }

    if (roadWorthiness) {
      setData((prevState) => {
        return { ...prevState, roadWorthiness };
      });
    }
  }, [
    makeOfVehicle,
    modelOfVehicle,
    yearOfMake,
    gender,
    vehicleLicense,
    roadWorthinessFile,
    roadWorthiness,
  ]);

  console.log(data, "Data");

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
          label="Registration Number"
          placeholder="Eg: 12346"
          value={data?.registrationNumber}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="registrationNumber"
          isRequired
          onBlur={() => {
            if (data?.registrationNumber) {
              askNiidHandler(data?.registrationNumber);
            }
          }}
          loading={askNiidRequestState?.isLoading}
        />

        <div className={classes.formImage}>
          <Image
            src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1745841449/Comprehensive_2_rrrhcm.svg"
            alt="Comprehensive Motor Insurance"
            width={200}
            height={100}
          />
        </div>

        <h4>Tell Us About Yourself</h4>

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
        />
        <Input
          label="Address"
          placeholder="Eg: ABC Close"
          value={data?.address}
          name="address"
          onChange={(e) => inputChangeHandler(e, setData)}
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

        <h4>Kindly Confirm Your Vehicle and Policy Details</h4>

        {askNiidRequestState?.data &&
          !askNiidRequestState?.isLoading &&
          askNiidRequestState?.data?.policyData?.type_of_cover
            ?.toLowerCase()
            .includes("comprehensive") && (
            <div className={classes.alert}>
              <Alert severity="warning">
                It appears you have an existing Comprehensive Vehicle Policy. We
                can begin this renewal process!
              </Alert>
            </div>
          )}

        {askNiidRequestState?.isLoading ? (
          <Loader />
        ) : (
          <>
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

            <Dropdown
              label="Do you require assistance with vehicle license and/or road worthiness"
              options={["Yes", "No"]}
              title="Select"
              selected={roadWorthiness}
              setSelected={setRoadWorthiness}
              isRequired
            />

            {roadWorthiness === "Yes" && (
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
              !data?.address ||
              !data?.roadWorthiness ||
              (data?.roadWorthiness === "Yes" &&
                !data?.vehicleLicense &&
                !data?.roadWorthinessFile)
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
