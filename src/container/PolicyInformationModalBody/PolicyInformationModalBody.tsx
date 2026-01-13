import Button from "@/components/Button/Button";
import classes from "./PolicyInformationModalBody.module.css";
import Close from "@/assets/svgIcons/Close";
import { useUserPolicyById } from "@/hooks/usePolicies";
import { useMemo } from "react";
import Loader from "@/components/Loader/Loader";
import { capitalize, structureWords } from "@/helpers/capitalize";
import moment from "moment";
import { formatObject } from "@/helpers/validateObjectValues";
import { downloadFile } from "@/helpers/download";
import { formatCurrency } from "@/helpers/formatAmount";

type PolicyInformationModalBodyTypes = {
  onClose?: () => void;
  id: string;
};

const PolicyInformationModalBody = ({
  onClose,
  id,
}: PolicyInformationModalBodyTypes) => {
  // Requests
  const { isLoading, data } = useUserPolicyById(id);

  // MEmos
  const policyInfo: { title: string; value: string }[] | undefined =
    useMemo(() => {
      if (data?.data) {
        return formatObject(data?.data?.policy, [
          "_id",
          "__v",
          "user",
          "createdAt",
          "agent",
          "certificate_summary",
        ]);
      }
    }, [data]);

  console.log(policyInfo, "Policy info");

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={classes.container}>
      <Close onClick={onClose} />
      <h2>Policy Information</h2>

      <div className={classes.body}>
        {policyInfo?.map((data, i) => {
          if (data?.title.includes("Date") || data?.title.includes("Updated")) {
            return (
              <div key={i}>
                <h4>{data?.title}</h4>
                <p>{moment(data?.value).format("Do MMMM, YYYY. hh:MM a")}</p>
              </div>
            );
          }

          if (data?.value?.includes("Https")) {
            return (
              <div key={i}>
                <h4>{data?.title}</h4>
                <p
                  onClick={() => downloadFile(data?.value, data?.title)}
                  className={classes.url}
                >
                  {capitalize(`Download ${data?.title}`)}
                </p>
              </div>
            );
          }

          if (data?.title === "Is Tracker Installed") {
            return (
              <div key={i}>
                <h4>Has Vehicle Tracker?</h4>
                <p
                  onClick={() => downloadFile(data?.value, data?.title)}
                  className={classes.url}
                >
                  {data?.value === "true" ? "Yes" : "No"}
                </p>
              </div>
            );
          }

          return (
            <div key={i}>
              <h4>{data?.title}</h4>
              <p>{structureWords(data?.value)}</p>
            </div>
          );
        })}
      </div>

      <div className={classes.buttonContainer}>
        <Button type="bordered" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default PolicyInformationModalBody;
