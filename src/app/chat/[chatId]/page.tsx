import Loader from "@/components/Loader/Loader";
import ChatLayout from "@/layouts/ChatLayout/ChatLayout";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ChatLayout />
    </Suspense>
  );
};

export default page;
