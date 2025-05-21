import Button from "@/components/Button/Button";
import classes from "./FleetInsuranceForm.module.css";
import Dropdown from "@/components/Dropdown/Dropdown";
import Input from "@/components/Input/Input";
import TextArea from "@/components/Textarea/TextArea";
import { fleetFormDataTypes, requestType } from "@/utilities/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { GENDERS, TODAY } from "@/utilities/constants";
import moment from "moment";
import { capitalize } from "@/helpers/capitalize";
import { states } from "@/utilities/states";

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

  // Effects
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
  }, [propertyType, gender, state]);

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

        <TextArea
          label="Talk to us"
          placeholder="Tell us what you want to achieve"
          name="comment"
          value={data?.comment}
          onChange={(e) => inputChangeHandler(e, setData)}
          isRequired
        />

        <div>
          <Button
            disabled={
              !data?.firstName ||
              !data?.lastName ||
              !data?.email ||
              !data?.phone ||
              !data?.address ||
              !data?.propertyType ||
              !data?.comment ||
              !data?.state ||
              !data?.occupation ||
              !data?.gender
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
