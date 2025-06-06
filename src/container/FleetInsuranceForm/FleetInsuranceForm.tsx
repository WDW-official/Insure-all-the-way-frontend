import Button from "@/components/Button/Button";
import classes from "./FleetInsuranceForm.module.css";
import Dropdown from "@/components/Dropdown/Dropdown";
import Input from "@/components/Input/Input";
import TextArea from "@/components/Textarea/TextArea";
import {
  fleetFormDataTypes,
  requestType,
  vehiclesType,
} from "@/utilities/types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { GENDERS, TODAY } from "@/utilities/constants";
import moment from "moment";
import { capitalize, capitalizeEachWord } from "@/helpers/capitalize";
import { states } from "@/utilities/states";
import Trash from "@/assets/svgIcons/Trash";
import {
  useCarMakes,
  useCarModels,
  useCarYearsByMakeAndModel,
} from "@/hooks/usePolicies";
import { mutate } from "swr";
import { vehicleTypes } from "@/utilities/motorInsuranceData";
import Plus from "@/assets/svgIcons/Plus";
import ExcelJS from "exceljs";
import Upload from "@/assets/svgIcons/Upload";
import { downloadFile, downloadInternalFile } from "@/helpers/download";
import { readExcelFile } from "@/helpers/readExcelFile";

type FleetInsuranceFormTypes = {
  data: fleetFormDataTypes;
  setData: Dispatch<SetStateAction<fleetFormDataTypes>>;
  onSubmit: () => void;
  requestState: requestType;
};

const FleetInsuranceForm = ({
  data,
  setData,
  onSubmit,
  requestState,
}: FleetInsuranceFormTypes) => {
  // States
  const [propertyType, setPropertyType] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [vehicles, setVehicles] = useState<vehiclesType[]>([
    {
      chassisNumber: "",
      registrationNumber: "",
      modelOfVehicle: "",
      makeOfVehicle: "",
      yearOfMake: "",
      vehicleType: "",
      engineNumber: "",
      vehicleValue: "",
      insuranceType: "",
    },
  ]);
  const [yearOfMake, setYearOfMake] = useState("");
  const [activeVehicle, setActiveVehicle] = useState<null | number>(null);
  const [makeOfVehicle, setMakeOfVehicle] = useState("");
  const [modelOfVehicle, setModelOfVehidle] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [insuranceType, setInsuranceType] = useState("");

  // Helpers

  const handleFileChange = (e: any) => {
    const file = e[0];

    if (file) {
      const fileType = file.type;
      const fileName = file.name;

      const validFileExtensions = [".xlsx", ".csv"];
      const fileExtension = fileName.slice(fileName.lastIndexOf("."));

      if (
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileType === "application/vnd.ms-excel" ||
        validFileExtensions.includes(fileExtension)
      ) {
        readExcelFile(file, setVehicles, setIsUploadFile);
      } else {
        alert("Please select a valid Excel file.");
      }
    } else {
      alert("No file selected.");
      setIsUploadFile(false);
    }
  };

  const sliceNumber = isUploadFile ? 2 : undefined;

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
    if (String(activeVehicle) && makeOfVehicle) {
      setVehicles((prevState) => {
        const updatedState = [...prevState];

        updatedState[activeVehicle as number].makeOfVehicle = makeOfVehicle;

        return updatedState;
      });
    }

    if (String(activeVehicle) && yearOfMake) {
      setVehicles((prevState) => {
        const updatedState = [...prevState];

        updatedState[activeVehicle as number].yearOfMake = yearOfMake;

        return updatedState;
      });
    }

    if (String(activeVehicle) && modelOfVehicle) {
      setVehicles((prevState) => {
        const updatedState = [...prevState];

        updatedState[activeVehicle as number].modelOfVehicle = modelOfVehicle;

        return updatedState;
      });
    }

    if (String(activeVehicle) && vehicleType) {
      setVehicles((prevState) => {
        const updatedState = [...prevState];

        updatedState[activeVehicle as number].vehicleType = vehicleType;

        return updatedState;
      });
    }

    if (String(activeVehicle) && insuranceType) {
      setVehicles((prevState) => {
        const updatedState = [...prevState];

        updatedState[activeVehicle as number].insuranceType = insuranceType;

        return updatedState;
      });
    }
  }, [
    activeVehicle,
    makeOfVehicle,
    yearOfMake,
    modelOfVehicle,
    vehicleType,
    insuranceType,
  ]);

  useEffect(() => {
    if (propertyType) {
      setData((prevState) => {
        return { ...prevState, propertyType };
      });
    }

    if (gender) {
      setData((prevState) => {
        return { ...prevState, gender };
      });
    }

    if (state) {
      setData((prevState) => {
        return { ...prevState, state };
      });
    }

    if (vehicles.length > 0) {
      setData((prevState) => {
        return { ...prevState, inventory: vehicles };
      });
    }
  }, [propertyType, gender, state, vehicles]);

  useEffect(() => {
    if (data?.propertyType) {
      const startDate = TODAY;
      const endDate = String(moment().add(1, "y").format("YYYY-MM-DD"));

      setData((prevState) => {
        return {
          ...prevState,
          startDate: startDate as string,
          endDate: endDate as string,
        };
      });
    }
  }, [data.propertyType]);

  useEffect(() => {
    if (requestState?.data && requestState?.id === "submit-form") {
      setVehicles([
        {
          chassisNumber: "",
          registrationNumber: "",
          modelOfVehicle: "",
          makeOfVehicle: "",
          yearOfMake: "",
          vehicleType: "",
          engineNumber: "",
          insuranceType: "",
          vehicleValue: "",
        },
      ]);
      setIsUploadFile(false);
    }
  }, [requestState?.data]);

  return (
    <section className={classes.container} id="insurance-form">
      <div className={classes.header}>
        <h4>Fleet Motor Insurance Form</h4>
        <p>
          Please ensure that all your information is correctly filled in,
          failure to do so may render your policy void.
        </p>
      </div>

      <form>
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
          label="Property Type"
          options={["Residential", "Corporate"]}
          title="Select "
          selected={propertyType || data?.propertyType}
          setSelected={setPropertyType}
          isRequired
        />

        <Dropdown
          label="State of Residence"
          options={states}
          title="Select State "
          selected={state || data?.state}
          setSelected={setState}
          isRequired
        />

        <h4>Tell us more about your vehicles</h4>
        {vehicles?.slice(0, sliceNumber)?.map((data, i) => {
          return (
            <div
              className={classes.section}
              onClick={() => setActiveVehicle(i)}
            >
              <div className={classes.sectionHeader}>
                <h4>
                  {data?.yearOfMake ||
                  data?.makeOfVehicle ||
                  data?.modelOfVehicle
                    ? `${data?.yearOfMake} ${data?.makeOfVehicle} ${data?.modelOfVehicle}`
                    : `Vehicle ${i + 1}`}
                </h4>
                {i > 0 && (
                  <Trash
                    onClick={() => {
                      setVehicles((prevState) => {
                        const updatedState = [...prevState];

                        if (updatedState.length > 1) {
                          const filteredState = updatedState.filter((_, j) => {
                            return j !== i;
                          });

                          return filteredState;
                        } else {
                          return updatedState;
                        }
                      });
                    }}
                  />
                )}
              </div>

              <Input
                label="Registration Number"
                placeholder="1234ABCD"
                value={vehicles[i].registrationNumber}
                onChange={(e) =>
                  setVehicles((prevState) => {
                    const updatedState = [...prevState];
                    updatedState[i].registrationNumber = e.target.value;
                    return updatedState;
                  })
                }
                isRequired
              />

              <Input
                label="Chassis Number"
                placeholder="Macbook Pro 2025"
                value={vehicles[i].chassisNumber}
                onChange={(e) =>
                  setVehicles((prevState) => {
                    const updatedState = [...prevState];
                    updatedState[i].chassisNumber = e.target.value;
                    return updatedState;
                  })
                }
                isRequired
              />

              <Input
                label="Engine Number"
                placeholder="Macbook Pro 2025"
                value={vehicles[i].engineNumber}
                onChange={(e) =>
                  setVehicles((prevState) => {
                    const updatedState = [...prevState];
                    updatedState[i].engineNumber = e.target.value;
                    return updatedState;
                  })
                }
                isRequired
              />

              <Dropdown
                label="Make of Vehicle"
                options={carMakes}
                selected={data?.makeOfVehicle}
                setSelected={setMakeOfVehicle}
                isLoading={carMakesIsLoading}
                isRequired
              />

              <Dropdown
                label="Model of Vehicle"
                options={(carModels as any) || []}
                isRequired
                isLoading={modelsIsLoading}
                selected={data?.modelOfVehicle}
                setSelected={setModelOfVehidle}
                disabled={!isUploadFile && !makeOfVehicle}
              />

              <Dropdown
                label="Year of make"
                options={carYears}
                isLoading={yearsIsLoading}
                isRequired
                selected={data?.yearOfMake}
                setSelected={setYearOfMake}
                disabled={!isUploadFile && (!makeOfVehicle || !modelOfVehicle)}
              />

              <Dropdown
                label="Vehicle Type"
                options={vehicleTypes}
                isRequired
                selected={data?.vehicleType}
                setSelected={setVehicleType}
              />

              <Input
                label="Vehicle Value"
                type="number"
                placeholder="100,000"
                value={vehicles[i].vehicleValue}
                onChange={(e) =>
                  setVehicles((prevState) => {
                    const updatedState = [...prevState];
                    updatedState[i].vehicleValue = e.target.value;
                    return updatedState;
                  })
                }
                isRequired
              />

              <Dropdown
                label="Insurance Type"
                options={[
                  "Third Party motor Insurance",
                  "Enhanced Third Party Motor Insurance",
                  "Comprehensive Motor Insurance",
                ]}
                isRequired
                selected={data?.insuranceType}
                setSelected={setInsuranceType}
              />
            </div>
          );
        })}

        {isUploadFile && vehicles?.length > 2 && (
          <p className={classes.inventoryCount}>
            and {vehicles?.length - 2} other entries
          </p>
        )}
        <div className={classes.formButtonSection}>
          {!isUploadFile ? (
            <>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setVehicles((prevState: vehiclesType[]) => {
                    return [
                      ...prevState,
                      {
                        chassisNumber: "",
                        registrationNumber: "",
                        modelOfVehicle: "",
                        makeOfVehicle: "",
                        yearOfMake: "",
                        vehicleType: "",
                        engineNumber: "",
                        vehicleValue: "",
                        insuranceType: "",
                      },
                    ];
                  });
                }}
              >
                <Plus fill="#000" />
                <span>Add a new vehicle</span>
              </Button>

              <div className={classes.upload}>
                <input
                  type="file"
                  id="uploadSheet"
                  onChange={(e) => handleFileChange(e?.target?.files)}
                />
                <label htmlFor="uploadSheet">
                  <Upload />
                  <span>Upload Excel file</span>
                </label>
              </div>
            </>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                setVehicles([
                  {
                    chassisNumber: "",
                    registrationNumber: "",
                    modelOfVehicle: "",
                    makeOfVehicle: "",
                    yearOfMake: "",
                    vehicleType: "",
                    engineNumber: "",
                    vehicleValue: "",
                    insuranceType: "",
                  },
                ]);

                setIsUploadFile(false);
              }}
              type="delete"
            >
              <Trash fill="#fff" />
              <span>Clear all enteries</span>
            </Button>
          )}

          <span
            onClick={() => {
              downloadFile(
                "https://res.cloudinary.com/dx3zrhslt/raw/upload/v1748619599/Fleet_Template_xxlymr.xlsx",
                "Fleet Inventory Template Sheet"
              );
            }}
          >
            Download sample inventory Excel file
          </span>
        </div>

        <div>
          <Button
            disabled={
              !data?.firstName ||
              !data?.lastName ||
              !data?.email ||
              !data?.phone ||
              !data?.address ||
              !data?.propertyType ||
              !data?.state ||
              !data?.occupation ||
              !data?.gender ||
              data?.inventory?.length < 1
            }
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            loading={requestState?.isLoading}
          >
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
};

export default FleetInsuranceForm;
