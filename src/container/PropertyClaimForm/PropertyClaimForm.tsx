import Close from "@/assets/svgIcons/Close";
import Input from "@/components/Input/Input";
import TextArea from "@/components/Textarea/TextArea";
import Button from "@/components/Button/Button";
import Phone from "@/assets/svgIcons/Phone";
import Draft from "@/assets/svgIcons/Draft";
import classes from "../MotorClaimsForm/MotorClaimsForm.module.css";
import Dropdown from "@/components/Dropdown/Dropdown";
import {
  claimsDataType,
  requestType,
  userPoliciesType,
} from "@/utilities/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import moment from "moment";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";

type PropertyClaimFormType = {
  onClose: () => void;
  data: userPoliciesType;
  claimsData: claimsDataType;
  setClaimsData: Dispatch<SetStateAction<claimsDataType>>;
  claimsHandler: () => void;
  requestState: requestType;
};

const PropertyClaimForm = ({
  onClose,
  data,
  claimsData,
  setClaimsData,
  claimsHandler,
  requestState,
}: PropertyClaimFormType) => {
  // States
  const [type, setType] = useState("");

  // Utils
  const minDate = moment().subtract(30, "days").format("YYYY-MM-DDTHH:mm");
  const maxDate = moment().format("YYYY-MM-DDTHH:mm");

  // Effects
  useEffect(() => {
    if (type) {
      setClaimsData((prevState) => {
        return { ...prevState, type };
      });
    }
  }, [type]);

  console.log(claimsData, "Datatt");

  return (
    <div className={classes.container}>
      <h4>All Risk Claim Form</h4>
      <p>Please fill the form below so we can serve you better</p>
      <Close onClick={onClose} />
      <form action="">
        <Dropdown
          label="Type Of Claim"
          options={["Theft", "Accident"]}
          selected={type}
          setSelected={setType}
        />
        <Input
          label="Location of Claim"
          placeholder="A Close, B State"
          value={claimsData?.location}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="location"
        />
        <Input
          label="Date and Time of Occurence"
          type="datetime-local"
          value={claimsData?.dateAndTime}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="dateAndTime"
          min={minDate}
          max={maxDate}
        />
        <Input
          label="Estimation of Repairs"
          type="number"
          value={claimsData?.estimate}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="estimate"
        />

        <TextArea
          label="Describe Property Involved (Model, Make, Year) "
          placeholder="Apple Macbook Pro, 2024"
          value={claimsData?.property}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="property"
        />
        <TextArea
          label="Provide the circumstances of loss or damage"
          placeholder="Type here..."
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
            <span>Submit Your Claim</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyClaimForm;
