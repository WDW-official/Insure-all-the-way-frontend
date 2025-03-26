import Dropdown from "@/components/Dropdown/Dropdown";
import Input from "@/components/Input/Input";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
// import { TODAY } from "@/utilities/constants";
import { states } from "@/utilities/states";
import { enhancedThirdPartyInsuranceFormTypes } from "@/utilities/types";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type EnhancedThordPartyMortrInsuranceForm3Types = {
  data: enhancedThirdPartyInsuranceFormTypes;
  setData: Dispatch<SetStateAction<enhancedThirdPartyInsuranceFormTypes>>;
};

const EnhancedThirdPartyMotorInsuranceForm3 = ({
  data,
  setData,
}: EnhancedThordPartyMortrInsuranceForm3Types) => {
  // States
  const [inspectionState, setInspectionState] = useState("");

  // Effects
  useEffect(() => {
    if (inspectionState) {
      setData((prevState) => {
        return { ...prevState, inspectionState };
      });
    }
  }, [inspectionState]);

  return (
    <form>
      <Dropdown
        options={states}
        label="Inspection State"
        selected={inspectionState}
        setSelected={setInspectionState}
      />
      <Input
        label="Inspection Address"
        placeholder="Eg. 2, Abc Street"
        name="inspectionAddress"
        value={data?.inspectionAddress}
        onChange={(e) => inputChangeHandler(e, setData)}
      />
      <Input
        label="Preferred Date for Inspection"
        type="date"
        name="dateForInspection"
        value={data?.dateForInspection}
        onChange={(e) => inputChangeHandler(e, setData)}
        // min={TODAY}
      />
      <Input
        label="Contact Name"
        placeholder="Eg. John Doe"
        name="contactName"
        value={data?.contactName}
        onChange={(e) => inputChangeHandler(e, setData)}
      />
      <Input
        label="Phone Number"
        type="phone"
        placeholder="Eg. +123 456 789 0"
        name="contactPhone"
        value={data?.contactPhone}
        onChange={(e) => inputChangeHandler(e, setData)}
      />
    </form>
  );
};

export default EnhancedThirdPartyMotorInsuranceForm3;
