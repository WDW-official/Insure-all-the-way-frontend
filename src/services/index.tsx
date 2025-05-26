"use client";

import { BASE_API_URL } from "@/config";
import { LOCAL_STORAGE_AUTH_KEY } from "@/utilities/constants";
import axios from "axios";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  }
};

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((axiosConfig) => {
  if (!navigator.onLine) {
    throw new Error("Please check your internet connection");
  }

  axiosConfig.headers.Authorization = `Bearer ${getToken()}`;

  return axiosConfig;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.status === 200 || response?.status === 201) {
      return response;
    } else {
      throw new Error(response?.data?.error?.message);
    }
  },
  async (err) => {
    return Promise.reject(err);
  }
);

export default axiosInstance;
