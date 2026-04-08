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
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import Loader from "@/components/Loader/Loader";
import { projectTime } from "@/helpers/projectTime";
import { Alert } from "@mui/material";
import { GENDERS, VEHICLE_COLORS, VEHICLE_TYPES } from "@/utilities/constants";
import {
  useCarMakes,
  useCarModels,
  useCarYearsByMakeAndModel,
} from "@/hooks/usePolicies";
import { mutate } from "swr";
import { capitalize, capitalizeEachWord } from "@/helpers/capitalize";
import FileUploadInput from "@/components/FileUploadInput/FileUploadInput";
import useError from "@/hooks/useError";
import { downloadFile } from "@/helpers/download";
import {
  extractPolicyCertificateFileName,
  extractPolicyCertificateUrl,
} from "@/helpers/policyResponse";

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
  const [vehicleLicense, setVehicleLicense] = useState<File[]>([]);
  const [roadWorthinessFile, setRoadWorthinessFile] = useState<File[]>([]);
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleType, setVehicletype] = useState("");
  const [engineCapacity, setEngineCapacity] = useState("");

  // Requests
  const { isLoading: carMakesIsLoading, data: carMakesData } = useCarMakes();
  const { isLoading: modelsIsLoading, data: carModelsData } = useCarModels(
    makeOfVehicle as string,
  );
  const { isLoading: yearsIsLoading, data: yearsData } =
    useCarYearsByMakeAndModel(
      makeOfVehicle as string,
      modelOfVehicle as string,
    );

  // Memos
  const carMakes = useMemo(() => {
    return carMakesData?.data?.makes?.map((data: string) =>
      capitalizeEachWord(data),
    );
  }, [carMakesData]);

  const carModels = useMemo(() => {
    return carModelsData?.data?.models?.map((data: string) => capitalize(data));
  }, [carModelsData]);

  const carYears = useMemo(() => {
    return yearsData?.data?.years;
  }, [yearsData]);

  // Hooks
  const { errorFlowFunction } = useError();
  const policyCertificateUrl = extractPolicyCertificateUrl(submitState?.data);
  const policyCertificateFileName = extractPolicyCertificateFileName(
    submitState?.data,
  );

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
      errorFunction(err) {
        errorFlowFunction(err);
      },
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
      setRoadWorthinessFile([]);
      setVehicleLicense([]);
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
            "D MMMM YYYY",
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

    if (engineCapacity) {
      setData((prevState) => {
        return { ...prevState, engineCapacity };
      });
    }

    if (vehicleColor) {
      setData((prevState) => {
        return { ...prevState, vehicleColor };
      });
    }

    if (vehicleType) {
      setData((prevState) => {
        return { ...prevState, vehicleType };
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
    vehicleLicense,
    roadWorthinessFile,
    engineCapacity,
    vehicleColor,
    vehicleType,
  ]);

  useEffect(() => {
    if (submitState?.data && submitState?.id === "submit-form") {
      setModalTrue(setModals, "insuranceCreated");
    }
  }, [submitState?.data]);

  console.log(data, "Check data");

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
              }}
              secondaryButtonText={
                policyCertificateUrl ? "Download Certificate" : undefined
              }
              onSecondaryClick={
                policyCertificateUrl
                  ? () =>
                      downloadFile(
                        policyCertificateUrl,
                        policyCertificateFileName,
                      )
                  : undefined
              }
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
                onSubmit();
              }}
              data={{
                user: {
                  email: data?.email,
                  firstName: data?.firstName,
                  lastName: data?.lastName,
                  phone: data?.phone,
                  address: data?.address,
                  state: data?.state,
                  occupation: data?.occupation,
                  gender: data?.gender,
                },
                insuranceType: "third-party-motor-insurance",
                registrationNumber: data?.registrationNumber,
                chasisNumber: data?.chasisNumber,
                plan: data?.product,
                startDate: data?.startDate,
                endDate: data?.endDate,
                makeOfVehicle: data?.makeOfVehicle,
                yearOfMake: data?.yearOfMake,
                modelOfVehicle: data?.modelOfVehicle,
              }}
              onClose={() => setAllModalsFalse(setModals)}
              hasLicenseRenewal={data?.vehicleLicense ? true : false}
              hasRoadWorthinessRevnewal={
                data?.roadWorthinessFile ? true : false
              }
              isKora={
                data?.vehicleLicense || data?.roadWorthinessFile ? true : false
              }
              policyType="motor-insurance"
              policySubType="third-party-motor-insurance"
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

      {/* <Recatpcha /> */}

      <section className={classes.container} id="insurance-form">
        <div className={classes.header}>
          <h4>Third Party Insurance Form</h4>
          <p>Get Your Third Party Insurance in 5 Minutes.</p>
        </div>

        <div className={classes.imageSection}>
          <Image
            src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1745841049/Third_Party_Fleet_Motor_y8ogou.svg"
            alt="Third party Motor Insurance"
            width={600}
            height={300}
          />
        </div>

        <form>
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

          {requestState?.isLoading && (
            <div className={classes.loaderAnimation}>
              <Image
                src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1749138906/IATW_Favicon_s65jyw.gif"
                alt="Loader"
                width={100}
                height={100}
              />
              <p>
                Give us a few seconds, we are just fetching your vehicle
                information…. In the meantime, please fill the form below.
              </p>
            </div>
          )}

          <h4>Tell Us About Yourself</h4>

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
            selected={gender || data?.gender}
            setSelected={setGender}
          />

          <Input
            label="Occupation"
            placeholder="Eg: Student"
            value={data?.occupation}
            name="occupation"
            onChange={(e) => inputChangeHandler(e, setData)}
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

          <h4>Kindly Confirm Your Vehicle Details</h4>

          {requestState?.data && !requestState?.isLoading && (
            <div className={classes.alert}>
              <Alert severity="warning">
                It appears you have an existing Third Party Policy. We can begin
                this renewal process!
              </Alert>
            </div>
          )}

          {requestState?.isLoading ? (
            <Loader />
          ) : (
            <>
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
                label="Vehicle Color"
                options={VEHICLE_COLORS}
                title="Select"
                selected={vehicleColor}
                setSelected={setVehicleColor}
                isRequired
              />

              <Dropdown
                label="Vehicle Type"
                options={VEHICLE_TYPES}
                title="Select"
                selected={vehicleType}
                setSelected={setVehicletype}
                isRequired
              />

              <Dropdown
                label="Engine Capacity"
                options={["0.1 - 1.59", "2.1 - 3.0", "3.1 - 12"]}
                title="Select"
                selected={engineCapacity}
                setSelected={setEngineCapacity}
                isRequired
              />

              <Input
                label="Engine Number"
                name="engineNumber"
                value={data?.engineNumber}
                onChange={(e) => inputChangeHandler(e, setData)}
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
                !data?.registrationNumber ||
                !data?.firstName ||
                !data?.lastName ||
                !data?.email ||
                !data?.phone ||
                !data?.address ||
                !data?.state ||
                !data?.chasisNumber ||
                !data?.makeOfVehicle ||
                !data?.modelOfVehicle ||
                !data?.yearOfMake ||
                !data?.startDate ||
                !data?.endDate ||
                !data?.product ||
                !data?.engineCapacity ||
                !data?.engineNumber ||
                !data?.vehicleColor ||
                !data?.vehicleType ||
                !data?.roadWorthiness ||
                (data?.roadWorthiness === "Yes" &&
                  !data?.vehicleLicense &&
                  !data?.roadWorthinessFile)
              }
              onClick={(e) => {
                e.preventDefault();
                setModalTrue(setModals, "payment");
              }}
              loading={submitState?.isLoading}
            >
              {requestState?.data ? "Renew" : "Submit"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default ThirdPartyInsuranceForm;
