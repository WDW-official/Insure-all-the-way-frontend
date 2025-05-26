import PoliciesSummaryCard from "@/components/PoliciesSummaryCard/PoliciesSummaryCard";
import classes from "../DashboardPoliciesSummary/DashboardPoliciesSummary.module.css";

const PolicyDetailsSummary = () => {
  return (
    <section className={classes.container}>
      <PoliciesSummaryCard title="Total Value of Insured Assets" amount={50} />
      <PoliciesSummaryCard title="Premium " amount={50} />
      <PoliciesSummaryCard title="Claims" amount={50} />
    </section>
  );
};

export default PolicyDetailsSummary;
