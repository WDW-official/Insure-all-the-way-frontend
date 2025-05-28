import Loader from "@/components/Loader/Loader";
import PolicyDetails from "@/container/PolicyDetails/PolicyDetails";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <PolicyDetails />
    </Suspense>
  );
};

export default page;
