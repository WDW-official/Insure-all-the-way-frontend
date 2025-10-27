import Loader from "@/components/Loader/Loader";
import AvonPlans from "@/container/AvonPlans/AvonPlans";
import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ApppLayout>
        <AvonPlans />
      </ApppLayout>
    </Suspense>
  );
};

export default page;
