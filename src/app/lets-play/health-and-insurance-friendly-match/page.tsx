import Loader from "@/components/Loader/Loader";
import HealthAndInsuranceFriendlyMatch from "@/container/HealthAndInsuranceFriendlyMatch/HealthAndInsuranceFriendlyMatch";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <HealthAndInsuranceFriendlyMatch />
    </Suspense>
  );
};

export default page;
