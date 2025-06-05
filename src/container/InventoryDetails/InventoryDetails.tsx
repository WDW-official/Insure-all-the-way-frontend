import Close from "@/assets/svgIcons/Close";
import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";
import { structureWords } from "@/helpers/capitalize";
import { formatCurrency } from "@/helpers/formatAmount";
import { formatObject } from "@/helpers/validateObjectValues";
import { usePolicyInventoryById } from "@/hooks/usePolicies";
import moment from "moment";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import classes from "../PolicyInformationModalBody/PolicyInformationModalBody.module.css";

type InventoryDetailsTypes = {
  inventoryId: string;
  onClose: () => void;
};

const InventoryDetails = ({ inventoryId, onClose }: InventoryDetailsTypes) => {
  // Router
  const { policyId } = useParams();

  // Requests
  const { isLoading, data } = usePolicyInventoryById(
    policyId as string,
    inventoryId
  );

  // MEmos
  const policyInfo: { title: string; value: string }[] | undefined =
    useMemo(() => {
      if (data?.data) {
        return formatObject(data?.data?.inventory, [
          "_id",
          "__v",
          "user",
          "createdAt",
          "agent",
          "isTrackerInstalled",
        ]);
      }
    }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={classes.container}>
      <Close onClick={onClose} />
      <h2>Inventory Information</h2>

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

          if (data?.title.includes("Value")) {
            return (
              <div key={i}>
                <h4>{data?.title}</h4>
                <p>{formatCurrency(data?.value)}</p>
              </div>
            );
          }

          if (!data?.value) {
            return (
              <div key={i}>
                <h4>{data?.title}</h4>
                <p>No data</p>
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

export default InventoryDetails;
