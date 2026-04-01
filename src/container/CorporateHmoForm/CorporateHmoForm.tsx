"use client";

import Dropdown from "@/components/Dropdown/Dropdown";
import classes from "./CorporateHmoForm.module.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import TextArea from "@/components/Textarea/TextArea";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";
import { requestHandler } from "@/helpers/requestHandler";
import { modalGenericType, requestType } from "@/utilities/types";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import useError from "@/hooks/useError";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";
import Modal from "@/components/Modal/Modal";
import { projectTime } from "@/helpers/projectTime";
import { states } from "@/utilities/states";
import { GENDERS } from "@/utilities/constants";
import { capitalize } from "@/helpers/capitalize";
import { downloadFile } from "@/helpers/download";
import {
  extractPolicyCertificateFileName,
  extractPolicyCertificateUrl,
} from "@/helpers/policyResponse";

const CorporateHmoForm = () => {
  // States
  const [corportePolicyData, setCorporatePolicyData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    nameOfOrganization: "",
    numberOfPeopleInOrganization: "",
    comments: "",
    startDate: "",
    endDate: "",
    occupation: "",
    gender: "",
  });
  const [corportePolicyFormData, setCorporatePolicyFormData] = useState(
    new FormData()
  );
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });
  const [modals, setModals] = useState<modalGenericType>({
    policyCreated: false,
  });
  const [state, setState] = useState("");
  const [gender, setGender] = useState("");
  const policyCertificateUrl = extractPolicyCertificateUrl(requestState?.data);
  const policyCertificateFileName = extractPolicyCertificateFileName(
    requestState?.data,
  );

  // Hooks
  const { errorFlowFunction } = useError();

  // COntext
  const { user } = useContext(AuthContext);

  // Requests
  const buildiingFormSubmitHandler = () => {
    requestHandler({
      url: "/policies/policy/health-insurance/corporate-and-group-hmo",
      method: "POST",
      isMultipart: true,
      data: corportePolicyFormData,
      state: requestState,
      setState: setRequestState,
      successFunction() {
        setModalTrue(setModals, "policyCreated");
        setCorporatePolicyData((prevstate) => {
          return {
            ...prevstate,
            nameOfOrganization: "",
            numberOfPeopleInOrganization: "",
            comments: "",
            startDate: "",
            endDate: "",
          };
        });
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
      // captchaAction: "corporate",
    });
  };

  // Effects
  useEffect(() => {
    if (user) {
      setCorporatePolicyData((prevState) => {
        return {
          ...prevState,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          phone: user?.phone,
          address: user?.address,
          state: user?.state,
          occupation: user?.occupation,
          gender: user?.gender,
        };
      });
    }
  }, [user]);

  useEffect(() => {
    const subCurporatePolicyFormData = new FormData();

    subCurporatePolicyFormData.append(
      "firstName",
      corportePolicyData?.firstName
    );
    subCurporatePolicyFormData.append("lastName", corportePolicyData?.lastName);
    subCurporatePolicyFormData.append("email", corportePolicyData?.email);
    subCurporatePolicyFormData.append("phone", corportePolicyData?.phone);
    subCurporatePolicyFormData.append("address", corportePolicyData?.address);
    subCurporatePolicyFormData.append("state", corportePolicyData?.state);
    subCurporatePolicyFormData.append(
      "occupation",
      corportePolicyData?.occupation
    );
    subCurporatePolicyFormData.append("gender", corportePolicyData?.gender);

    subCurporatePolicyFormData.append(
      "nameOfOrganization",
      corportePolicyData?.nameOfOrganization
    );
    subCurporatePolicyFormData.append(
      "numberOfPeopleInOrganization",
      corportePolicyData?.numberOfPeopleInOrganization
    );
    subCurporatePolicyFormData.append("comments", corportePolicyData?.comments);
    subCurporatePolicyFormData.append(
      "startDate",
      corportePolicyData?.startDate
    );
    subCurporatePolicyFormData.append("endDate", corportePolicyData?.endDate);

    setCorporatePolicyFormData(subCurporatePolicyFormData);
  }, [corportePolicyData]);

  useEffect(() => {
    if (corportePolicyData?.startDate) {
      setCorporatePolicyData((prevState) => {
        return {
          ...prevState,
          endDate: projectTime(corportePolicyData?.startDate, "1", "y"),
        };
      });
    }

    if (state) {
      setCorporatePolicyData((prevState) => {
        return {
          ...prevState,
          state,
        };
      });
    }

    if (gender) {
      setCorporatePolicyData((prevState) => {
        return {
          ...prevState,
          gender,
        };
      });
    }
  }, [corportePolicyData?.startDate, state, gender]);

  return (
    <>
      {modals.policyCreated && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              title="Your have successfully applied for an Corporate and Group HMO Policy!"
              caption="An agent will get back to you regarding next steps."
              onClose={() => setAllModalsFalse(setModals)}
              onClick={() => {
                setAllModalsFalse(setModals);
              }}
              buttontext="Okay"
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

      <section className={classes.container} id="insurance-form">
        <div className={classes.header}>
          <h4>Corporate HMO Form</h4>
          <p>Effortless Corporate HMO Enrollment for a Healthier Workforce.</p>
        </div>

        <form>
          <Input
            label="First name"
            placeholder="Eg: John"
            value={corportePolicyData?.firstName}
            name="firstName"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
          />

          <Input
            label="Last name"
            placeholder="Eg: Doe"
            value={corportePolicyData?.lastName}
            name="lastName"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
          />

          <Input
            label="Email Address"
            placeholder="Eg: abc@example.com"
            value={corportePolicyData?.email}
            name="email"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
          />

          <Input
            label="Phone"
            placeholder="Eg: +123 45 6789 0"
            value={corportePolicyData?.phone}
            name="phone"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
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
            value={corportePolicyData?.occupation}
            name="occupation"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
          />

          <Dropdown
            label="State of Residence"
            options={states}
            title="Select State"
            selected={state}
            setSelected={setState}
          />

          <Input
            label="Address"
            placeholder="Eg: +123 45 6789 0"
            value={corportePolicyData?.address}
            name="address"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
          />

          <Input
            label="Name of Organisation or Group"
            placeholder="Eg. Eniola & Sons"
            value={corportePolicyData?.nameOfOrganization}
            name="nameOfOrganization"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
          />

          <Input
            label="Start Date"
            placeholder="Eg. Eniola & Sons"
            type="date"
            value={corportePolicyData?.startDate}
            name="startDate"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
          />
          <Input
            label="End Date"
            placeholder="Eg. Eniola & Sons"
            type="date"
            value={corportePolicyData?.endDate}
            name="endDate"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
            readOnly
          />

          <Input
            label="Number of people in Organisation or Group"
            placeholder="Eg. 10"
            type="number"
            value={corportePolicyData?.numberOfPeopleInOrganization}
            name="numberOfPeopleInOrganization"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
          />

          <TextArea
            label="Talk To Us"
            placeholder="Tell us more"
            value={corportePolicyData?.comments}
            name="comments"
            onChange={(e) => inputChangeHandler(e, setCorporatePolicyData)}
            isRequired
          />

          <div>
            <Button
              disabled={!areAllValuesFilled(corportePolicyData)}
              onClick={(e) => {
                e.preventDefault();
                buildiingFormSubmitHandler();
              }}
              loading={requestState?.isLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default CorporateHmoForm;
