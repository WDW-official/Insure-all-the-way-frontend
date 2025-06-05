"use client";

import Input from "@/components/Input/Input";
import classes from "./AllRiskForm.module.css";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import { states } from "@/utilities/states";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  allRiskDataTypes,
  allRiskInventoryTypes,
  modalGenericType,
  requestType,
} from "@/utilities/types";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";
import { projectTime } from "@/helpers/projectTime";
import { GENDERS, TODAY } from "@/utilities/constants";
import { requestHandler } from "@/helpers/requestHandler";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import useError from "@/hooks/useError";
import Modal from "@/components/Modal/Modal";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";
import { capitalize } from "@/helpers/capitalize";
import { formatCurrency } from "@/helpers/formatAmount";
import Plus from "@/assets/svgIcons/Plus";
import Trash from "@/assets/svgIcons/Trash";
import Upload from "@/assets/svgIcons/Upload";
import { downloadInternalFile } from "@/helpers/download";
import ExcelJS from "exceljs";

const AllRiskForm = () => {
  // States
  const [allRiskFormData, setAllRiskFormData] = useState<allRiskDataTypes>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    state: "",
    premium: "",
    startDate: "",
    endDate: "",
    gender: "",
    occupation: "",
    inventory: [],
  });
  const [state, setState] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });
  const [modals, setModals] = useState<modalGenericType>({
    policyCreated: false,
  });
  const [gender, setGender] = useState("");
  const [allRiskInventory, setAllRiskInventory] = useState<
    allRiskInventoryTypes[]
  >([
    {
      specifications: "",
      serialNumber: "",
      value: "",
      deviceType: "",
      model: "",
      modelNumber: "",
      imei: "",
    },
  ]);
  const [activeAllRiskInventoryIndex, setActiveAllRiskInventoryIndex] =
    useState<number | null>(null);
  const [isUploadFile, setIsUploadFile] = useState(false);

  // FormData
  const [allRiskFormDataFOrmData, setAllRiskFormDataFormData] = useState(
    new FormData()
  );

  // Hooks
  const { errorFlowFunction } = useError();

  // Context
  const { user } = useContext(AuthContext);

  // Utils
  const allRiskFormSubmitHandler = async () => {
    requestHandler({
      url: "/policies/policy/property-insurance/all-risk",
      method: "POST",
      isMultipart: true,
      data: allRiskFormDataFOrmData,
      state: requestState,
      setState: setRequestState,
      // captchaAction: "allRisk",
      successFunction() {
        setModalTrue(setModals, "policyCreated");
        setAllRiskFormData((prevstate) => {
          return {
            ...prevstate,
            premium: "",
            startDate: "",
            endDate: "",
            inventory: [],
          };
        });
        setAllRiskInventory([
          {
            specifications: "",
            serialNumber: "",
            value: "",
            deviceType: "",
            imei: "",
            model: "",
            modelNumber: "",
          },
        ]);
        setIsUploadFile(false);
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
    });
  };

  const readExcelFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event: any) => {
      const buffer = event.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      const jsonData: any[] = [];

      let headers: string[] = [];

      worksheet.eachRow((row: any, rowNumber: number) => {
        const rowValues = row.values.slice(1);

        if (rowNumber === 1) {
          headers = rowValues.map((header: string) => String(header).trim());
        } else {
          const rowObject: any = {};
          headers.forEach((key, index) => {
            rowObject[key] = rowValues[index] ?? "";
          });
          jsonData.push(rowObject);
        }
      });

      setAllRiskInventory(jsonData);
    };

    reader.readAsArrayBuffer(file);
    setIsUploadFile(true);
  };

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
        readExcelFile(file);
      } else {
        alert("Please select a valid Excel file.");
      }
    } else {
      alert("No file selected.");
      setIsUploadFile(false);
    }
  };

  // Effects
  useEffect(() => {
    if (user) {
      setAllRiskFormData((prevState) => {
        return {
          ...prevState,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          phone: user?.phone,
          address: user?.address,
          state: user?.state,
          gender: user?.gender,
          occupation: user?.occupation,
        };
      });
    }
  }, [user]);

  useEffect(() => {
    if (allRiskInventory.length) {
      const percentageCosts = allRiskInventory.map(
        (data) => Number(data?.value) * 0.03
      );

      let premium = 0;

      for (let i = 0; i < percentageCosts.length; i++) {
        premium += percentageCosts[i];
      }

      setAllRiskFormData((prevState) => {
        return { ...prevState, premium: String(premium) };
      });
    }

    if (allRiskFormData?.startDate) {
      setAllRiskFormData((prevState) => {
        return {
          ...prevState,
          endDate: projectTime(allRiskFormData?.startDate, "1", "y"),
        };
      });
    }

    if (state) {
      setAllRiskFormData((prevState) => {
        return { ...prevState, state };
      });
    }

    if (gender) {
      setAllRiskFormData((prevState) => {
        return {
          ...prevState,
          gender,
        };
      });
    }

    if (allRiskInventory.length) {
      setAllRiskFormData((prevState) => {
        return {
          ...prevState,
          inventory: allRiskInventory,
        };
      });
    }
  }, [allRiskFormData?.startDate, state, gender, allRiskInventory]);

  useEffect(() => {
    if (String(activeAllRiskInventoryIndex) && deviceType) {
      setAllRiskInventory((prevState) => {
        const updatedState = [...prevState];

        updatedState[activeAllRiskInventoryIndex as number].deviceType =
          deviceType?.toLowerCase();

        return updatedState;
      });
    }
  }, [activeAllRiskInventoryIndex, deviceType]);

  useEffect(() => {
    const subAllRiskFormData = new FormData();

    subAllRiskFormData.append("email", allRiskFormData?.email);
    subAllRiskFormData.append("firstName", allRiskFormData?.firstName);
    subAllRiskFormData.append("lastName", allRiskFormData?.lastName);
    subAllRiskFormData.append("phone", allRiskFormData?.phone);
    subAllRiskFormData.append("address", allRiskFormData?.address);
    subAllRiskFormData.append("state", allRiskFormData?.state);
    subAllRiskFormData.append("premium", allRiskFormData?.premium);
    subAllRiskFormData.append("startDate", allRiskFormData?.startDate);
    subAllRiskFormData.append("endDate", allRiskFormData?.endDate);
    subAllRiskFormData.append("gender", allRiskFormData?.gender);
    subAllRiskFormData.append("occupation", allRiskFormData?.occupation);
    subAllRiskFormData.append(
      "inventory",
      JSON.stringify(allRiskFormData.inventory)
    );

    setAllRiskFormDataFormData(subAllRiskFormData);
  }, [allRiskFormData]);

  const sliceNumber = isUploadFile ? 6 : undefined;

  return (
    <>
      {modals.policyCreated && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              title="Your have successfully applied for an All Risks Insurance Policy!"
              caption="An agent will get back to you regarding next steps."
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
          <h4>All Risks Policy Form</h4>
          <p>
            Comprehensive Protection for Your Property - All Risks Insurance
            Policy.
          </p>
        </div>

        <form>
          <h4>Tell Us about yourself</h4>
          <Input
            label="First Name"
            placeholder="Eg: John"
            value={allRiskFormData?.firstName}
            name="firstName"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
            isRequired
          />
          <Input
            label="Last Name"
            placeholder="Eg: Doe"
            value={allRiskFormData?.lastName}
            name="lastName"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
            isRequired
          />
          <Input
            label="Email"
            placeholder="Eg: abc@xyz.com"
            value={allRiskFormData?.email}
            name="email"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
            isRequired
          />{" "}
          <Input
            label="Phone Number"
            placeholder="Eg: +123 45 6789"
            value={allRiskFormData?.phone}
            name="phone"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
            isRequired
          />{" "}
          <Input
            label="Address"
            placeholder="Eg: 10 Abc Close"
            value={allRiskFormData?.address}
            name="address"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
            isRequired
          />{" "}
          <Dropdown
            label="State"
            options={states}
            title="Select"
            selected={state || allRiskFormData?.state}
            setSelected={setState}
            isRequired
          />
          <Dropdown
            label="Gender"
            options={GENDERS.map((data) => capitalize(data) as string)}
            title="Select Gender"
            selected={gender || allRiskFormData?.gender}
            setSelected={setGender}
            isRequired
          />
          <Input
            label="Occupation"
            placeholder="Eg: Student"
            value={allRiskFormData?.occupation}
            name="occupation"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
            isRequired
          />
          <Input
            label="Start Date"
            type="date"
            value={allRiskFormData?.startDate}
            name="startDate"
            onChange={(e) => inputChangeHandler(e, setAllRiskFormData)}
            min={TODAY}
            isRequired
          />
          <Input
            label="End Date"
            type="date"
            value={allRiskFormData?.endDate}
            name="endDate"
            readOnly
          />
          <h4>Tell us about your device(s)</h4>
          {allRiskInventory?.slice(0, sliceNumber)?.map((data, i) => {
            return (
              <div
                className={classes.section}
                key={i}
                onClick={() => setActiveAllRiskInventoryIndex(i)}
              >
                <div className={classes.sectionHeader}>
                  <h4>{data?.specifications || `Item ${i + 1}`}</h4>
                  {i > 0 && (
                    <Trash
                      onClick={() => {
                        setAllRiskInventory((prevState) => {
                          const updatedState = [...prevState];

                          if (updatedState.length > 1) {
                            const filteredState = updatedState.filter(
                              (_, j) => {
                                return j !== i;
                              }
                            );

                            return filteredState;
                          } else {
                            return updatedState;
                          }
                        });
                      }}
                    />
                  )}
                </div>

                <Dropdown
                  label="What type of device would you like to insure"
                  title="Select"
                  options={["Laptop", "Phone"]}
                  selected={data?.deviceType}
                  setSelected={setDeviceType}
                  isRequired
                />

                <Input
                  label="Specifications of the device"
                  placeholder="Macbook Pro 2025"
                  value={allRiskInventory[i].specifications}
                  onChange={(e) =>
                    setAllRiskInventory((prevState) => {
                      const updatedState = [...prevState];

                      updatedState[i].specifications = e.target.value;

                      return updatedState;
                    })
                  }
                  isRequired
                />

                <Input
                  label="Value of the device"
                  placeholder="200,000"
                  type="number"
                  value={data?.value}
                  onChange={(e) =>
                    setAllRiskInventory((prevState) => {
                      const updatedState = [...prevState];

                      updatedState[i].value = e.target.value;

                      return updatedState;
                    })
                  }
                  isRequired
                />

                <Input
                  label="Serial Number"
                  placeholder="ABC123"
                  value={data?.serialNumber}
                  onChange={(e) =>
                    setAllRiskInventory((prevState) => {
                      const updatedState = [...prevState];

                      updatedState[i].serialNumber = e.target.value;

                      return updatedState;
                    })
                  }
                  isRequired
                />

                {data?.deviceType?.toLowerCase() === "phone" && (
                  <>
                    <Input
                      label="Phone IMEI Number"
                      placeholder="12345678910"
                      type="number"
                      value={data?.imei}
                      onChange={(e) =>
                        setAllRiskInventory((prevState) => {
                          const updatedState = [...prevState];
                          updatedState[i].imei = e.target.value;
                          return updatedState;
                        })
                      }
                      isRequired
                      readOnly={data?.deviceType?.toLowerCase() !== "phone"}
                      tip="IMEI Number is required for phone a tablet devices only"
                    />

                    <Input
                      label="Model"
                      placeholder="12345678910"
                      value={data?.model}
                      onChange={(e) =>
                        setAllRiskInventory((prevState) => {
                          const updatedState = [...prevState];
                          updatedState[i].model = e.target.value;
                          return updatedState;
                        })
                      }
                      isRequired
                      readOnly={data?.deviceType?.toLowerCase() !== "phone"}
                      tip="Model is required for phone a tablet devices only"
                    />

                    <Input
                      label="Model Number"
                      placeholder="1234/4EXE"
                      value={data?.modelNumber}
                      onChange={(e) =>
                        setAllRiskInventory((prevState) => {
                          const updatedState = [...prevState];
                          updatedState[i].modelNumber = e.target.value;
                          return updatedState;
                        })
                      }
                      isRequired
                      readOnly={data?.deviceType?.toLowerCase() !== "phone"}
                      tip="Model Number is required for phones a tablet devices only"
                    />
                  </>
                )}
              </div>
            );
          })}
          {isUploadFile && allRiskInventory?.length > 2 && (
            <p className={classes.inventoryCount}>
              and {allRiskInventory?.length - 2} other entries
            </p>
          )}
          <div className={classes.formButtonSection}>
            {!isUploadFile ? (
              <>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setAllRiskInventory(
                      (prevState: allRiskInventoryTypes[]) => {
                        return [
                          ...prevState,
                          {
                            deviceType: "",
                            serialNumber: "",
                            specifications: "",
                            value: "",
                            imei: "",
                            model: "",
                            modelNumber: "",
                          },
                        ];
                      }
                    );
                  }}
                >
                  <Plus fill="#000" />
                  <span>Add a new device</span>
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
                  setAllRiskInventory([
                    {
                      deviceType: "",
                      serialNumber: "",
                      specifications: "",
                      value: "",
                      imei: "",
                      model: "",
                      modelNumber: "",
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
                downloadInternalFile(
                  "https://res.cloudinary.com/dx3zrhslt/raw/upload/v1749120801/All_Risk_Template_f0aiho.xlsx",
                  "All Risk Inventory Template Sheet"
                );
              }}
            >
              Download sample inventory Excel file
            </span>
          </div>
          <h4>Total</h4>
          <Input
            label="Premium"
            placeholder="10"
            readOnly
            value={`₦${formatCurrency(allRiskFormData?.premium)}`}
            isRequired
          />
          <div>
            <Button
              disabled={!areAllValuesFilled(allRiskFormData)}
              loading={requestState?.isLoading}
              onClick={(e) => {
                e.preventDefault();
                allRiskFormSubmitHandler();
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default AllRiskForm;
