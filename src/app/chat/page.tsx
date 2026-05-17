import Loader from "@/components/Loader/Loader";
import ChatLayout from "@/layouts/ChatLayout/ChatLayout";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ChatLayout />
    </Suspense>
  );
};

export default page;
