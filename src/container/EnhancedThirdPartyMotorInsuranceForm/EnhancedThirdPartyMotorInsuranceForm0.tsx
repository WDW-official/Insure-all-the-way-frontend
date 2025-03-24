import Dropdown from "@/components/Dropdown/Dropdown";
import Input from "@/components/Input/Input";
import { AuthContext } from "@/context/AuthContext";
import { capitalize } from "@/helpers/capitalize";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { GENDERS } from "@/utilities/constants";
import { states } from "@/utilities/states";
import { enhancedThirdPartyInsuranceFormTypes } from "@/utilities/types";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type EnhancedThordPartyMortrInsuranceForm0Types = {
  data: enhancedThirdPartyInsuranceFormTypes;
  setData: Dispatch<SetStateAction<enhancedThirdPartyInsuranceFormTypes>>;
};

const EnhancedThirdPartyMotorInsuranceForm0 = ({
  data,
  setData,
}: EnhancedThordPartyMortrInsuranceForm0Types) => {
  // Context
  const { user } = useContext(AuthContext);

  // States
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");

  // Effects
  useEffect(() => {
    if (user) {
      setData((prevState) => {
        return {
          ...prevState,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          phoneNumber: user?.phone,
          address: user?.address,
          state: user?.state,
          gender: user?.gender,
          occupation: user?.occupation,
        };
      });
    }
  }, [user]);

  useEffect(() => {
    if (state) {
      setData((prevState) => {
        return { ...prevState, state };
      });
    }

    if (gender) {
      setData((prevState) => {
        return { ...prevState, gender };
      });
    }
  }, [state, gender]);

  return (
    <form>
      <Input
        label="First name"
        placeholder="Eg. John"
        value={data?.firstName}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="firstName"
      />
      <Input
        label="Last name"
        placeholder="Eg. Doe"
        value={data?.lastName}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="lastName"
      />
      <Input
        label="Email Address"
        placeholder="Eg. abc@example.com"
        type="email"
        value={data?.email}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="email"
      />
      <Input
        label="Phone Number"
        type="phone"
        placeholder="Eg. +123 456 789 0"
        value={data?.phone}
        onChange={(e) => inputChangeHandler(e, setData)}
        name="phone"
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
        label="State of Residence"
        options={states}
        title="Select State"
        selected={state || data?.state}
        setSelected={setState}
        isRequired
      />
    </form>
  );
};

export default EnhancedThirdPartyMotorInsuranceForm0;
