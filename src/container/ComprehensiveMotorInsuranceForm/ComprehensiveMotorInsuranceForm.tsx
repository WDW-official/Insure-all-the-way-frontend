import Button from "@/components/Button/Button";
import Dropdown from "@/components/Dropdown/Dropdown";
import Input from "@/components/Input/Input";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import classes from "./ComprehensiveMotorInsuranceForm.module.css";
import { states } from "@/utilities/states";
import { comprehensiveeFormDataTypes, requestType } from "@/utilities/types";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import moment from "moment";
import { TODAY } from "@/utilities/constants";
import { formatCurrency } from "@/helpers/formatAmount";

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

  // Utils

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
        />
        <Input
          label="Last Name"
          placeholder="Eg: Doe"
          value={data?.lastName}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="lastName"
        />
        <Input
          label="Email"
          placeholder="Eg: example@gmail.com"
          type="email"
          value={data?.email}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="email"
        />
        <Input
          label="Phone Number"
          placeholder="+234 12 345 6789"
          value={data?.phone}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="phone"
        />
        <Input
          label="Registration Number"
          placeholder="Eg: 12346"
          value={data?.registrationNumber}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="registrationNumber"
        />
        <Dropdown
          label="State"
          options={states}
          title="Select State"
          selected={state || data?.state}
          setSelected={setState}
        />

        <Dropdown
          label="Cover Period"
          options={["6 Months", "1 Year"]}
          title="Select"
          selected={coverPeriod || data?.coverPeriod}
          setSelected={setCoverPeriod}
        />

        <Input
          label="Vehicle Value"
          placeholder="Eg: 200,000"
          type="number"
          value={data?.vehicleValue}
          onChange={(e) => inputChangeHandler(e, setData)}
          name="vehicleValue"
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
              !data?.premium
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
