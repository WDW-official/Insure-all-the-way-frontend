import Loader from "@/components/Loader/Loader";
import HygeiaPlans from "@/container/HygeiaPlans/HygeiaPlans";
import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ApppLayout>
        <HygeiaPlans />
      </ApppLayout>
    </Suspense>
  );
};

export default page;
