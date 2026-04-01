import Loader from "@/components/Loader/Loader";
import RequireAuth from "@/components/RequireAuth/RequireAuth";
import ChatLayout from "@/layouts/ChatLayout/ChatLayout";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RequireAuth>
        <ChatLayout />
      </RequireAuth>
    </Suspense>
  );
};

export default page;
