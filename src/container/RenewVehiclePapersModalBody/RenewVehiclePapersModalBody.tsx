import { useUserPolicyById } from "@/hooks/usePolicies";
import classes from "./RenewVehiclePapersModalBody.module.css";
import Loader from "@/components/Loader/Loader";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import Close from "@/assets/svgIcons/Close";
import { downloadFile } from "@/helpers/download";
import Button from "@/components/Button/Button";
import Upload from "@/assets/svgIcons/Upload";
import Edit from "@/assets/svgIcons/Edit";
import FileUploadInput from "@/components/FileUploadInput/FileUploadInput";
import Download from "@/assets/svgIcons/Download";
import { Checkbox } from "@mui/material";

type RenewVehidlePapersModalBodyTypes = {
  onClose?: () => void;
  id: string;
  onRenew?: () => void;
  vehicleRenewalFormData?: FormData;
  setVehicleRenewalFOrmData: Dispatch<SetStateAction<FormData>>;
  isRoadWorthiness: boolean;
  setIsRoadWorthiness: Dispatch<SetStateAction<boolean>>;
  isVehicleLicense: boolean;
  setIsVehicleLicense: Dispatch<SetStateAction<boolean>>;
};

const RenewVehiclePapersModalBody = ({
  onClose,
  id,
  onRenew,
  setVehicleRenewalFOrmData,
  isRoadWorthiness,
  setIsRoadWorthiness,
  isVehicleLicense,
  setIsVehicleLicense,
}: RenewVehidlePapersModalBodyTypes) => {
  // Requests
  const { isLoading, data } = useUserPolicyById(id);

  //   States
  const [edit, setEdit] = useState({
    vehiclePapers: false,
  });
  const [vehicleLicense, setVehicleLicense] = useState<File[]>([]);

  // MEmos
  const policyInfo = useMemo(() => {
    return data?.data?.policy;
  }, [data]);

  //   Effects
  useEffect(() => {
    const subVehicleRenewalFormData = new FormData();
    subVehicleRenewalFormData.append("vehicleLicense", vehicleLicense[0]);
    subVehicleRenewalFormData.append("policyId", id);

    setVehicleRenewalFOrmData(subVehicleRenewalFormData);
  }, [vehicleLicense, id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={classes.container}>
      <Close onClick={onClose} />
      <h2>Renew Vehicle Documents</h2>

      <div className={classes.body}>
        {!edit?.vehiclePapers ? (
          <div>
            <h4>Vehicle License</h4>
            <p className={classes.url}>
              <span>
                {policyInfo?.vehicleLicense
                  ? "Edit/Download File"
                  : "Upload File"}
              </span>
              <span
                onClick={() =>
                  setEdit((prevState) => {
                    return { ...prevState, vehiclePapers: true };
                  })
                }
              >
                {policyInfo?.vehicleLicense ? <Edit /> : <Upload />}
              </span>

              {policyInfo?.vehicleLicense && (
                <span
                  onClick={() => [
                    downloadFile(policyInfo?.vehicleLicense, "Vehicle License"),
                  ]}
                >
                  <Download />
                </span>
              )}
            </p>
          </div>
        ) : (
          <div className={classes.fileUpload}>
            <FileUploadInput
              files={vehicleLicense}
              setFiles={setVehicleLicense}
              title="Upload Vehicle License"
              id="vehicleLicenseFile"
              accept=".pdf"
            />
          </div>
        )}

        <div className={classes.roadWorthiness}>
          <Checkbox
            style={{ color: "#a7c7e7" }}
            TouchRippleProps={{ center: true }}
            checked={isVehicleLicense}
            onChange={(e) => {
              console.log(e.target.checked, "Checked");
              setIsVehicleLicense(e.target.checked);
            }}
            id="vehicleLicense"
          />
          <label htmlFor="vehicleLicense">Renew Vehicle License</label>
        </div>

        <div className={classes.roadWorthiness}>
          <Checkbox
            style={{ color: "#a7c7e7" }}
            TouchRippleProps={{ center: true }}
            checked={isRoadWorthiness}
            onChange={(e) => {
              console.log(e.target.checked, "Checked");
              setIsRoadWorthiness(e.target.checked);
            }}
            id="roadWorthiness"
          />
          <label htmlFor="roadWorthiness">Renew Road Worthiness</label>
        </div>

        <div className={classes.buttonContainer}>
          <Button
            onClick={() => {
              if (onRenew) {
                onRenew();
              }
            }}
            disabled={
              (!policyInfo?.vehicleLicense && vehicleLicense?.length === 0) ||
              (!isVehicleLicense && !isRoadWorthiness)
            }
          >
            Renew Vehicle Documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RenewVehiclePapersModalBody;
