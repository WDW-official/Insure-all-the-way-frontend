import { AxiosError, AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { requestType } from "../utilities/types";
import axiosInstance from "../services/index";
import { getCaptchaToken } from "./captcha";

type RequestType = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  data?: Record<string, any> | FormData | any;
  isMultipart?: boolean;
  state?: requestType;
  setState?: Dispatch<SetStateAction<requestType>>;
  successFunction?: (res?: AxiosResponse) => void;
  errorFunction?: (err: AxiosError) => void;
  load?: boolean;
  requestCleanup?: boolean;
  id?: string;
  captchaAction?: string;
};

export async function requestHandler({
  method,
  url,
  headers = {},
  data,
  isMultipart,
  setState,
  successFunction,
  errorFunction,
  load,
  requestCleanup,
  id = "",
  captchaAction,
}: RequestType) {
  const updateState = (stateUpdate: Partial<requestType>) => {
    if (setState) {
      setState((prev) => ({ ...prev, ...stateUpdate, id }));
    }
  };

  const cleanupState = () => {
    if (requestCleanup && setState) {
      setTimeout(() => {
        setState({
          isLoading: false,
          data: null,
          error: null,
          id,
        });
      }, 5000);
    }
  };

  if (load !== false && setState) {
    updateState({ isLoading: true });
  }

  const makeRequest = async (finalData: any) => {
    try {
      const response = await axiosInstance({
        method,
        url,
        headers: {
          "Content-Type": isMultipart
            ? "multipart/form-data"
            : "application/json",
          ...headers,
        },
        data: finalData,
      });

      updateState({ isLoading: false, data: response?.data, error: null });
      cleanupState();

      if (successFunction) successFunction(response);
    } catch (error: any) {
      const message = error.response?.data?.message || error?.message;
      updateState({ isLoading: false, data: null, error: message });
      cleanupState();

      if (errorFunction) errorFunction(error);
    }
  };

  if (captchaAction) {
    const token = await getCaptchaToken(captchaAction);

    if (!token) {
      updateState({
        isLoading: false,
        error: "Suspicious activity detected",
        data: null,
      });
      return;
    }

    let finalData: any = data;

    if (isMultipart) {
      const formData = new FormData();

      if (data instanceof FormData) {
        for (const [key, value] of data.entries()) {
          formData.append(key, value);
        }
      } else if (data && typeof data === "object") {
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value as any);
        });
      }

      formData.append("token", token);
      finalData = formData;
    } else {
      finalData = { ...(data || {}), token };
    }

    await makeRequest(finalData);
  } else {
    await makeRequest(data);
  }
}
