import classes from "./EnhancedThirdPartyMotorInsuranceForm.module.css";
import StepLayout from "@/components/StepLayout/StepLayout";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import EnhancedThordPartyMortrInsuranceForm1 from "./EnhancedThordPartyMortrInsuranceForm1";
import EnhancedThirdPartyMotorInsuranceForm2 from "./EnhancedThirdPartyMotorInsuranceForm2";
import EnhancedThirdPartyMotorInsuranceForm3 from "./EnhancedThirdPartyMotorInsuranceForm3";
import EnhancedThirdPartyMotorInsurancePreview from "./EnhancedThirdPartyMotorInsurancePreview";
import EnhancedThirdPartyMotorInsuranceForm0 from "./EnhancedThirdPartyMotorInsuranceForm0";
import {
  enhancedThirdPartyInsuranceFormTypes,
  requestType,
} from "@/utilities/types";
import { Dispatch, SetStateAction } from "react";
import Modal from "@/components/Modal/Modal";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";

type EnhancedThirdPartyMotorInsuranceFormTypes = {
  data: enhancedThirdPartyInsuranceFormTypes;
  setData: Dispatch<SetStateAction<enhancedThirdPartyInsuranceFormTypes>>;
  submitForm: () => void;
  requestState: requestType;
};

const EnhancedThirdPartyMotorInsuranceForm = ({
  data,
  setData,
  submitForm,
  requestState,
}: EnhancedThirdPartyMotorInsuranceFormTypes) => {
  // Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  // Router
  const step = updateSearchParams("step", undefined, "get");

  // Utils
  const sectionsHeaders = [
    "Personal Information",
    "Vehicle Information",
    "Documents",
    "Inspection Appointment",
    "Preview",
    "Make Payment",
  ];

  let container;

  if (step === "2") {
    container = (
      <EnhancedThordPartyMortrInsuranceForm1 data={data} setData={setData} />
    );
  } else if (step === "3") {
    container = (
      <EnhancedThirdPartyMotorInsuranceForm2 data={data} setData={setData} />
    );
  } else if (step === "4") {
    container = (
      <EnhancedThirdPartyMotorInsuranceForm3 data={data} setData={setData} />
    );
  } else if (step === "5") {
    container = (
      <EnhancedThirdPartyMotorInsurancePreview
        data={data}
        submitForm={submitForm}
        requestState={requestState}
      />
    );
  } else {
    container = (
      <EnhancedThirdPartyMotorInsuranceForm0 data={data} setData={setData} />
    );
  }

  return (
    <section className={classes.container} id="insurance-form">
      <div className={classes.header}>
        <h4>Enhanced Third Party Insurance Form</h4>
        <p>
          Maximize Your Coverage with Enhanced Third Party Protection. Get
          Started Today.
        </p>
      </div>

      <StepLayout
        steps={[1, 2, 3, 4, 5]}
        title={sectionsHeaders[Number(step) - 1]}
        notShowButton={Number(step) > 4}
        disabled={
          step === "1"
            ? !data?.firstName ||
              !data?.lastName ||
              !data?.email ||
              !data?.phone ||
              !data?.address ||
              !data?.state ||
              !data?.plan
            : step === "2"
            ? !data?.makeOfVehicle ||
              !data?.yearOfMake ||
              !data?.modelOfVehicle ||
              !data?.startDate ||
              !data?.endDate ||
              !data?.registrationNumber ||
              !data?.engineNumber ||
              !data?.chasisNumber ||
              !data?.vehicleType ||
              !data?.roadWorthiness ||
              (data?.roadWorthiness === "Yes" &&
                !data?.vehicleLicense &&
                !data?.roadWorthinessFile)
            : step === "3"
            ? !data?.proofOfOwnership || !data?.id
            : step === "4"
            ? !data?.inspectionState ||
              !data?.inspectionAddress ||
              !data?.dateForInspection ||
              !data?.contactName ||
              !data?.contactPhone
            : step === "5"
            ? areAllValuesFilled(data)
            : false
        }
      >
        {container}
      </StepLayout>
    </section>
  );
};

export default EnhancedThirdPartyMotorInsuranceForm;
