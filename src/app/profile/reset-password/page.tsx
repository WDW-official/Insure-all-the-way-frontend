import Loader from "@/components/Loader/Loader";
import ProfileResetPassword from "@/container/ProfileResetPassword/ProfileResetPassword";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ProfileResetPassword />
    </Suspense>
  );
};

export default page;
