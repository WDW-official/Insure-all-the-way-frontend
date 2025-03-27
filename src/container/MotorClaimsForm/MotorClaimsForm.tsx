import Input from "@/components/Input/Input";
import TextArea from "@/components/Textarea/TextArea";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import classes from "./MotorClaimsForm.module.css";
import Close from "@/assets/svgIcons/Close";
import Button from "@/components/Button/Button";
import Phone from "@/assets/svgIcons/Phone";
import Draft from "@/assets/svgIcons/Draft";
import {
  claimsDataType,
  requestType,
  userPoliciesType,
} from "@/utilities/types";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";
import moment from "moment";

type MotorClaimsFormType = {
  onClose: () => void;
  data: userPoliciesType;
  claimsData: claimsDataType;
  setClaimsData: Dispatch<SetStateAction<claimsDataType>>;
  claimsHandler: () => void;
  requestState: requestType;
};

const MotorClaimsForm = ({
  onClose,
  data,
  claimsData,
  setClaimsData,
  claimsHandler,
  requestState,
}: MotorClaimsFormType) => {
  // Utils
  const minDate = moment().subtract(30, "days").format("YYYY-MM-DDTHH:mm");
  const maxDate = moment().format("YYYY-MM-DDTHH:mm");

  // Effects
  useEffect(() => {
    if (data?.registrationNumber) {
      setClaimsData((prevState) => {
        return { ...prevState, registrationNumber: data?.registrationNumber };
      });
    }
  }, [data?.registrationNumber]);

  return (
    <div className={classes.container}>
      <h4>Motor Claim Form</h4>
      <p>Please fill the form below so we can serve you better</p>
      <Close onClick={onClose} />
      <form>
        <Input
          label="Date and TIme of Loss"
          type="datetime-local"
          value={claimsData?.dateAndTime}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="dateAndTime"
          min={minDate}
          max={maxDate}
        />
        <Input
          label="Vehicle Registration Number"
          readOnly={Boolean(data?.registrationNumber)}
          value={claimsData?.registrationNumber}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="registrationNumber"
        />
        <Input
          label="Location of Theft/Accident"
          value={claimsData?.location}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="location"
        />
        <TextArea
          label="Narration of Accident "
          value={claimsData?.narration}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="narration"
        />
        <div className={classes.buttonSection}>
          <a
            href={`tel:${data?.agent?.phone}`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Phone />
            <span>Call your Agent</span>
          </a>

          <Button
            disabled={!areAllValuesFilled(claimsData)}
            onClick={(e) => {
              e.preventDefault();
              claimsHandler();
            }}
            loading={requestState?.isLoading}
          >
            <Draft />
            <span>Submit Your Motor Claim</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MotorClaimsForm;
