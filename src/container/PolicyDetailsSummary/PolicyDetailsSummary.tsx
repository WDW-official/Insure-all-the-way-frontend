import Loader from "@/components/Loader/Loader";
import PoliciesSummaryCard from "@/components/PoliciesSummaryCard/PoliciesSummaryCard";
import { usePolicyStats } from "@/hooks/usePolicies";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import classes from "../DashboardPoliciesSummary/DashboardPoliciesSummary.module.css";

const PolicyDetailsSummary = () => {
  // Router
  const { policyId } = useParams();

  // Requests
  const { isLoading, data } = usePolicyStats(policyId as string);

  // Memos
  const policySummary = useMemo(() => {
    return data?.data;
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className={classes.container}>
      <PoliciesSummaryCard
        title="Total Value of Insured Assets"
        amount={String(policySummary?.totalValue)}
      />
      <PoliciesSummaryCard title="Premium " amount={policySummary?.premium} />
      <PoliciesSummaryCard
        title="Claims"
        amount={policySummary?.claims}
        notAmount
      />
    </section>
  );
};

export default PolicyDetailsSummary;
