import Loader from "@/components/Loader/Loader";
import ProfileAccount from "@/container/Profile/ProfileAccount";
import Profile from "@/container/Profile/ProfileAccount";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ProfileAccount />;
    </Suspense>
  );
};

export default page;
