"use client";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { useToast } from "@/context/ToastContext";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import ProfileLayout from "@/layouts/ProfileLayout/ProfileLayout";
import { requestType } from "@/utilities/types";
import React, { useContext, useState } from "react";
import classes from "./ProfileResetPassword.module.css";
import { AuthContext } from "@/context/AuthContext";

const ProfileResetPassword = () => {
  // States
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    error: null,
    data: null,
  });

  //   Context
  const { logout } = useContext(AuthContext);

  //   Hooks
  const { errorFlowFunction } = useError();
  const { showToast } = useToast();

  //   Requests
  const handlePasswordReset = async () => {
    await requestHandler({
      url: "/auth/reset-password-logged-in",
      method: "PATCH",
      data: {
        oldPassword: passwords?.oldPassword,
        newPassword: passwords?.newPassword,
      },
      state: requestState,
      setState: setRequestState,
      requestCleanup: true,
      successFunction(res) {
        showToast(res?.data?.message, "success");
        setPasswords({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        logout();
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
    });
  };

  return (
    <ProfileLayout className={classes.container}>
      <h4>Reset Password</h4>
      <form>
        <Input
          type="password"
          label="Old Password"
          name="oldPassword"
          value={passwords?.oldPassword}
          onChange={(e) => inputChangeHandler(e, setPasswords)}
          isRequired
        />
        <Input
          type="password"
          label="New Password"
          name="newPassword"
          value={passwords?.newPassword}
          onChange={(e) => inputChangeHandler(e, setPasswords)}
          isRequired
        />
        <Input
          type="password"
          label="Confirm New Password"
          name="confirmNewPassword"
          value={passwords?.confirmNewPassword}
          onChange={(e) => inputChangeHandler(e, setPasswords)}
          condition={passwords?.confirmNewPassword === passwords?.newPassword}
          errorMessage="New password and confirm new password must match"
          isRequired
        />

        <Button
          disabled={
            passwords.newPassword !== passwords?.confirmNewPassword ||
            !passwords?.oldPassword ||
            !passwords?.newPassword ||
            !passwords?.confirmNewPassword
          }
          loading={requestState?.isLoading}
          onClick={(e) => {
            e.preventDefault();
            handlePasswordReset();
          }}
        >
          Reset Password
        </Button>
      </form>
    </ProfileLayout>
  );
};

export default ProfileResetPassword;
