import { formatObject } from "@/helpers/validateObjectValues";
import classes from "./PolicyDetailsDetails.module.css";
import { useMemo } from "react";
import { policyType } from "@/utilities/types";
import moment from "moment";
import { structureWords } from "@/helpers/capitalize";
import Loader from "@/components/Loader/Loader";

type PolicyDetailsDetailsTypes = {
  data: policyType;
  loading: boolean;
};

const PolicyDetailsDetails = ({ data, loading }: PolicyDetailsDetailsTypes) => {
  // Memo
  const policyInfo: { title: string; value: string }[] | undefined =
    useMemo(() => {
      if (data) {
        return formatObject(data, [
          "_id",
          "__v",
          "createdAt",
          "firstLogin",
          "inventory",
          "user",
          "agent",
          "isPaid",
        ]);
      }
    }, [data]);

  console.log(policyInfo, "Policy info");

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={classes.container}>
      <h4>More information</h4>

      <div className={classes.body}>
        {policyInfo
          ?.filter((data) => data?.value !== "[object Object]")
          ?.map((data, i) => {
            if (
              data?.title === "Updated At" ||
              data?.title?.toLowerCase().includes("date")
            ) {
              return (
                <div key={i}>
                  <h4>{data?.title}</h4>
                  <p>{moment(data?.value).format("Do MMMM, YYYY. hh:mma")}</p>
                </div>
              );
            }
            if (data?.value?.toLowerCase().includes("https")) {
              return (
                <div key={i}>
                  <h4>{data?.title}</h4>
                  <a
                    href={data?.value}
                    target="_blank"
                    style={{ cursor: "pointer" }}
                  >
                    {data?.value}
                  </a>
                </div>
              );
            }

            if (data?.title === "Is Tracker Installed") {
              return (
                <div key={i}>
                  <h4>Has Tracker Installed?</h4>
                  <p>{data?.value === "true" ? "Yes" : "No"}</p>
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
    </div>
  );
};

export default PolicyDetailsDetails;
