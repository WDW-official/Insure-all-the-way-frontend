import { useUserPolicyById } from "@/hooks/usePolicies";
import classes from "./RenewVehiclePapersModalBody.module.css";
import Loader from "@/components/Loader/Loader";
import { useEffect, useMemo, useState } from "react";
import Close from "@/assets/svgIcons/Close";
import { downloadFile } from "@/helpers/download";
import Button from "@/components/Button/Button";
import Upload from "@/assets/svgIcons/Upload";
import Edit from "@/assets/svgIcons/Edit";
import FileUploadInput from "@/components/FileUploadInput/FileUploadInput";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import { useToast } from "@/context/ToastContext";

type RenewVehidlePapersModalBodyTypes = {
  onClose?: () => void;
  id: string;
};

const RenewVehiclePapersModalBody = ({
  onClose,
  id,
}: RenewVehidlePapersModalBodyTypes) => {
  // Requests
  const { isLoading, data } = useUserPolicyById(id);

  //   States
  const [edit, setEdit] = useState({
    vehiclePapers: false,
    roadWorthiness: false,
  });
  const [vehicleLicense, setVehicleLicense] = useState<File[]>([]);
  const [roadWorthiness, setRoadWorthiness] = useState<File[]>([]);
  const [vehicleRenewalFormData, setVehicleRenewalFOrmData] = useState(
    new FormData()
  );
  const [requestState, setRequestState] = useState({
    isLoading: false,
    data: null,
    error: null,
  });

  // MEmos
  const policyInfo = useMemo(() => {
    return data?.data?.policy;
  }, [data]);

  //   Hooks
  const { errorFlowFunction } = useError();
  const { showToast } = useToast();

  //   Requests
  const handleVehiclePaperRenewalinitiation = () => {
    requestHandler({
      url: "/super-agent/initiate-paper-renewal",
      method: "POST",
      data: vehicleRenewalFormData,
      isMultipart: true,
      state: requestState,
      setState: setRequestState,
      errorFunction(err) {
        errorFlowFunction(err);
      },
      successFunction(res) {
        showToast(res?.data?.message, "success");
        if (onClose) {
          onClose();
        }
      },
    });
  };

  //   Effects
  useEffect(() => {
    const subVehicleRenewalFormData = new FormData();
    subVehicleRenewalFormData.append("vehicleLicense", vehicleLicense[0]);
    subVehicleRenewalFormData.append("roadWorthiness", roadWorthiness[0]);
    subVehicleRenewalFormData.append("policyId", id);

    setVehicleRenewalFOrmData(subVehicleRenewalFormData);
  }, [vehicleLicense, roadWorthiness, id]);

  if (isLoading) {
    return <Loader />;
  }

  console.log(policyInfo);

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
                {policyInfo?.vehicleLicense ? "Edit File" : "Upload File"}
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
            </p>
          </div>
        ) : (
          <div className={classes.fileUpload}>
            <FileUploadInput
              files={vehicleLicense}
              setFiles={setVehicleLicense}
              title="Upload Vehicle License"
              id="vehicleLicense"
              accept=".pdf"
            />
          </div>
        )}

        {!edit?.roadWorthiness ? (
          <div>
            <h4>Road Worthiness</h4>
            <p className={classes.url}>
              <span>
                {policyInfo?.roadWorthiness ? "Edit File" : "Upload File"}
              </span>
              <span
                onClick={() =>
                  setEdit((prevState) => {
                    return { ...prevState, roadWorthiness: true };
                  })
                }
              >
                {policyInfo?.roadWorthiness ? <Edit /> : <Upload />}
              </span>
            </p>
          </div>
        ) : (
          <div className={classes.fileUpload}>
            <FileUploadInput
              files={roadWorthiness}
              setFiles={setRoadWorthiness}
              title="Upload Road Worthiness"
              id="roadWorthiness"
              accept=".pdf"
            />
          </div>
        )}

        <Button
          loading={requestState?.isLoading}
          onClick={handleVehiclePaperRenewalinitiation}
          disabled={
            !policyInfo?.roadWorthiness &&
            !policyInfo?.vehicleLicense &&
            vehicleLicense?.length === 0 &&
            roadWorthiness?.length === 0
          }
        >
          Renew Vehicle Documents
        </Button>
      </div>
    </div>
  );
};

export default RenewVehiclePapersModalBody;
