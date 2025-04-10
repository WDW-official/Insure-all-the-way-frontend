import Loader from "@/components/Loader/Loader";
import AxaPlans from "@/container/AxaPlans/AxaPlans";
import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ApppLayout>
        <AxaPlans />
      </ApppLayout>
    </Suspense>
  );
};

export default page;
