import React, { useState } from "react";
import classes from "../PolicyReminderForm/PolicyReminderForm.module.css";
import AuthLayout from "@/layouts/AuthLayout/AuthLayout";
import Logo from "@/components/Logo/Logo";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { requestType } from "@/utilities/types";
import { requestHandler } from "@/helpers/requestHandler";
import { useToast } from "@/context/ToastContext";
import useError from "@/hooks/useError";

const ForgotPassword = () => {
  // States
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: "" });
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

  //   Hooks
  const { showToast } = useToast();
  const { errorFlowFunction } = useError();

  //   Requests
  const handleForgotPassword = () => {
    requestHandler({
      method: "POST",
      url: "/auth/initiate-forgot-password",
      data: forgotPasswordData,
      state: requestState,
      setState: setRequestState,
      id: "forgot-password",
      requestCleanup: true,
      successFunction(res) {
        console.log(res);
        showToast(res?.data?.message, "success");
      },
      errorFunction(err) {
        console.log(err);
        errorFlowFunction(err);
      },
    });
  };

  return (
    <AuthLayout>
      <div className={classes.container}>
        <Logo />
        <h4>Forgot Your Password?</h4>
        <p>
          Enter your email below to receive a password reset link. If you don’t
          see the email in a few minutes, check your spam folder.
        </p>
        <Input
          label="Email"
          isRequired
          name="email"
          value={forgotPasswordData?.email}
          onChange={(e) => inputChangeHandler(e, setForgotPasswordData)}
        />

        <Button
          loading={requestState?.isLoading}
          onClick={(e) => {
            e.preventDefault();
            handleForgotPassword();
          }}
          disabled={!forgotPasswordData?.email}
          type="secondary"
        >
          Confirm Email
        </Button>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
