import Close from "@/assets/svgIcons/Close";
import classes from "./CreateLeadForm.module.css";
import Input from "@/components/Input/Input";
import TextArea from "@/components/Textarea/TextArea";
import Button from "@/components/Button/Button";
import { useState } from "react";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import { useToast } from "@/context/ToastContext";

type CreateLeadFormTypes = {
  onClose: () => void;
};

const CreateLeadForm = ({ onClose }: CreateLeadFormTypes) => {
  // States
  const [leadsData, setLeadsData] = useState({
    name: "",
    phone: "",
    numberPlate: "",
    remark: "",
    email: "",
    vehiclePaperExpiryDate: "",
  });
  const [requestState, setRequestState] = useState({
    isLoading: false,
    data: null,
    error: null,
  });

  //   Hooks
  const { errorFlowFunction } = useError();
  const { showToast } = useToast();

  //   Requests
  const handleSubmitLead = () => {
    requestHandler({
      url: "/agent/reminder-lead",
      method: "POST",
      data: leadsData,
      state: requestState,
      setState: setRequestState,
      successFunction: (res) => {
        showToast(res?.data?.message, "success");
        onClose();
      },
      errorFunction: (err) => {
        errorFlowFunction(err);
      },
    });
  };

  return (
    <section className={classes.container}>
      <Close onClick={onClose} />
      <h2>{"Create a Reminder"}</h2>

      <form className={classes.body}>
        <Input
          label="Name"
          placeholder="Eg: John Doe"
          name="name"
          value={leadsData?.name}
          onChange={(e) => inputChangeHandler(e, setLeadsData)}
          tip="Name should be in the format Last name, First name"
        />
        <Input
          label="Email Address"
          placeholder="Eg: Jogn Doe"
          name="email"
          value={leadsData?.email}
          onChange={(e) => inputChangeHandler(e, setLeadsData)}
        />
        <Input
          label="Phone Number"
          type="phone"
          placeholder="Eg: +234 12 345 678"
          name="phone"
          value={leadsData?.phone}
          onChange={(e) => inputChangeHandler(e, setLeadsData)}
        />
        <Input
          label="Number Plate"
          placeholder="Eg: 123456abc"
          name="numberPlate"
          value={leadsData?.numberPlate}
          onChange={(e) => inputChangeHandler(e, setLeadsData)}
        />
        <Input
          label="Vehicle Paper Expiry Date"
          placeholder="Eg: 12/03/2025"
          name="vehiclePaperExpiryDate"
          value={leadsData?.vehiclePaperExpiryDate}
          onChange={(e) => inputChangeHandler(e, setLeadsData)}
          type="date"
        />

        <TextArea
          label="Remark"
          placeholder="Eg: Nice chat!"
          name="remark"
          value={leadsData?.remark}
          onChange={(e) => inputChangeHandler(e, setLeadsData)}
        />

        <div className={classes.buttonContainer}>
          <Button type="bordered" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={
              !leadsData?.name || !leadsData?.phone || !leadsData?.numberPlate
            }
            loading={requestState?.isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmitLead();
            }}
          >
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CreateLeadForm;
