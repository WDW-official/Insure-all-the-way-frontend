import LeadwayPlans from "@/container/LeadwayPlans/LeadwayPlans";
import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <ApppLayout>
        <LeadwayPlans />
      </ApppLayout>
    </Suspense>
  );
};

export default page;
