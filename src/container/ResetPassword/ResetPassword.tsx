import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Logo from "@/components/Logo/Logo";
import { useToast } from "@/context/ToastContext";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import AuthLayout from "@/layouts/AuthLayout/AuthLayout";
import { requestType } from "@/utilities/types";
import React, { useState } from "react";
import classes from "../PolicyReminderForm/PolicyReminderForm.module.css";

const ResetPassword = () => {
  //
  // State
  const [loginData, setLoginData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

  // Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  // Router
  const token = updateSearchParams("reset-token", undefined, "get");

  // Hooks
  const { errorFlowFunction } = useError();
  const { showToast } = useToast();

  // Request

  const resetPassword = () => {
    requestHandler({
      url: `/auth/forgot-password/reset-password/${token}`,
      method: "POST",
      data: { newPassword: loginData?.password },
      state: requestState,
      setState: setRequestState,
      id: "reset-password",
      requestCleanup: true,
      successFunction(res) {
        showToast(res?.data?.message, "success");
        setLoginData((prevState) => {
          return { ...prevState, password: "", confirmPassword: "" };
        });

        updateSearchParams("auth", "sign-in", "set");
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
    });
  };

  return (
    <AuthLayout>
      <div className={classes.container}>
        <Logo />
        <h4>Reset your Password</h4>
        <p>
          To start interacting with your policies, please reset your password to
          a custom one
        </p>

        <Input
          label="New Password"
          type="password"
          isRequired
          name="password"
          value={loginData?.password}
          onChange={(e) => inputChangeHandler(e, setLoginData)}
        />

        <Input
          label="Confirm Password"
          type="password"
          isRequired
          name="confirmPassword"
          value={loginData?.confirmPassword}
          onChange={(e) => inputChangeHandler(e, setLoginData)}
          tip="Your password should be at least 8 characters"
        />

        <Button
          loading={requestState?.isLoading}
          onClick={(e) => {
            e.preventDefault();
            resetPassword();
          }}
          disabled={loginData?.password !== loginData?.confirmPassword}
        >
          Reset Password
        </Button>

        <p
          className={classes.forgot}
          onClick={() => {
            updateSearchParams("auth", "sign-in", "set");
          }}
        >
          Remember Password? <span>Sign In</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
