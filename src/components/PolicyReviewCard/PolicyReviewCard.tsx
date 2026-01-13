import { userPoliciesType } from "@/utilities/types";
import classes from "./PolicyReviewCard.module.css";
import { capitalize, structureWords } from "@/helpers/capitalize";
import moment from "moment";

type PolicyReviewCardType = {
  data: userPoliciesType;
};

const PolicyReviewCard = ({ data }: PolicyReviewCardType) => {
  const startDate = moment(data?.startDate);
  const endDate = moment(data?.endDate);
  const today = moment();

  const totalDays = endDate.diff(startDate, "days");

  const elapsedDays = today.diff(startDate, "days");

  const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);

  return (
    <div className={classes.policyReview}>
      <p>{capitalize(data?.insuranceType?.substring(0, 1))}</p>
      <div>
        <h4>{structureWords(data?.insuranceType)}</h4>
      </div>
      <div>
        <div style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default PolicyReviewCard;
