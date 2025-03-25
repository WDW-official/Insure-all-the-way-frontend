import Button from "@/components/Button/Button";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import {
  enhancedThirdPartyInsuranceFormTypes,
  requestType,
} from "@/utilities/types";
import classes from "./EnhancedThirdPartyMotorInsuranceForm.module.css";

type EnhancedThirdPartyMotorInsurancePreviewTypes = {
  data: enhancedThirdPartyInsuranceFormTypes;
  requestState: requestType;
  submitForm: () => void;
};

const EnhancedThirdPartyMotorInsurancePreview = ({
  data,
  requestState,
  submitForm,
}: EnhancedThirdPartyMotorInsurancePreviewTypes) => {
  // Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  return (
    <div>
      <div className={classes.info}>
        <h4>Make of Vehicle</h4>
        <p>{data?.makeOfVehicle || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Year of Make</h4>
        <p>{data?.yearOfMake || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Model of Vehicle</h4>
        <p>{data?.modelOfVehicle || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Start Date</h4>
        <p>{data?.startDate || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>End Date</h4>
        <p>{data?.endDate || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Registration Number</h4>
        <p>{data?.registrationNumber || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Engine Number</h4>
        <p>{data?.engineNumber || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Chasis Number</h4>
        <p>{data?.chasisNumber || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Vehicle Type</h4>
        <p>{data?.vehicleType || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Preferred Policy</h4>
        <p>{data?.plan || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Proof of Ownership</h4>
        <p>{data?.proofOfOwnership?.name || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Valid Means of ID</h4>
        <p>{data?.id?.name || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Inspection State</h4>
        <p>{data?.inspectionState || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Inspection Address</h4>
        <p>{data?.inspectionAddress || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Date of Inspection</h4>
        <p>{data?.dateForInspection || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Contact Name</h4>
        <p>{data?.contactName || "N/A"}</p>
      </div>

      <div className={classes.info}>
        <h4>Contact Phone Number</h4>
        <p>{data?.contactPhone || "N/A"}</p>
      </div>

      <div className={classes.buttonSection}>
        <Button
          type="bordered"
          onClick={() => {
            updateSearchParams("step", "4", "set");
          }}
        >
          Previous
        </Button>
        <Button
          type="secondary"
          loading={requestState?.isLoading}
          onClick={() => submitForm()}
        >
          Submit & Pay
        </Button>
      </div>
    </div>
  );
};

export default EnhancedThirdPartyMotorInsurancePreview;
