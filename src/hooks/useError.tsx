import { useContext } from "react";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "@/context/AuthContext";
import { mutate } from "swr";

const useError = () => {
  // Context
  const { showToast } = useToast();
  const { logout } = useContext(AuthContext);

  // Utils
  const errorFlowFunction = (err: any) => {
    if (err?.status === 401) {
      logout();

      mutate(() => true, undefined, { revalidate: false });
    }

    showToast(
      err?.response?.data?.error ||
        err?.response?.data?.message ||
        "An error occured, please try again in few minutes",
      "error"
    );
  };

  return { errorFlowFunction };
};
export default useError;
