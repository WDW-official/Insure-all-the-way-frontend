"use client";

import ProfileLayout from "@/layouts/ProfileLayout/ProfileLayout";
import classes from "./ProfileAccount.module.css";
import Input from "@/components/Input/Input";
import { useContext, useEffect, useState } from "react";
import { requestType, userType } from "@/utilities/types";
import Dropdown from "@/components/Dropdown/Dropdown";
import { states } from "@/utilities/states";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import Button from "@/components/Button/Button";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/Loader/Loader";
import { capitalize } from "@/helpers/capitalize";
import { requestHandler } from "@/helpers/requestHandler";
import { useToast } from "@/context/ToastContext";
import useError from "@/hooks/useError";
import { mutate } from "swr";

const ProfileAccount = () => {
  // States
  const [userInfo, setUserInfo] = useState<userType>({
    lastName: "",
    firstName: "",
    email: "",
    address: "",
    gender: "",
    occupation: "",
    phone: "",
    state: "",
    status: "",
  });
  const [state, setState] = useState("");
  const [gender, setGender] = useState("");
  const [userRequestState, setUserRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

  // Context
  const { user, requestState, getUser } = useContext(AuthContext);

  // Utils
  const disableButton =
    user?.firstName === userInfo?.firstName &&
    user?.lastName === userInfo?.lastName &&
    user?.email === userInfo?.email &&
    user?.address === userInfo?.address &&
    user?.phone === userInfo?.phone &&
    user?.occupation === userInfo?.occupation &&
    user?.gender === userInfo?.gender &&
    user?.state === userInfo?.state;

  // Hooks
  const { showToast } = useToast();
  const { errorFlowFunction } = useError();

  // Requests
  const handleUpdateUserDetails = () => {
    requestHandler({
      url: "/auth/profile",
      data: userInfo,
      method: "PATCH",
      state: userRequestState,
      setState: setUserRequestState,
      requestCleanup: true,
      successFunction(res) {
        showToast(res?.data?.message, "success");
        getUser(false);
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
    });
  };

  // Effects
  useEffect(() => {
    if (user) {
      setUserInfo((prevState) => {
        return { ...user };
      });
    }
    setState(user?.state as string);
    setGender(user?.gender as string);
  }, [user]);

  useEffect(() => {
    if (gender) {
      setUserInfo((prevState) => {
        return { ...prevState, gender };
      });
    }

    if (state) {
      setUserInfo((prevState) => {
        return { ...prevState, state };
      });
    }
  }, [gender, state]);

  return (
    <ProfileLayout className={classes.container}>
      <h4>Account Information</h4>

      {requestState?.isLoading ? (
        <Loader />
      ) : (
        <form>
          <Input
            label="First name"
            name="firstName"
            value={userInfo?.firstName}
            onChange={(e) => inputChangeHandler(e, setUserInfo)}
          />
          <Input
            label="Last name"
            name="lastName"
            value={userInfo?.lastName}
            onChange={(e) => inputChangeHandler(e, setUserInfo)}
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={userInfo?.email}
            onChange={(e) => inputChangeHandler(e, setUserInfo)}
            readOnly
          />
          <Input
            label="Address"
            name="address"
            value={userInfo?.address}
            onChange={(e) => inputChangeHandler(e, setUserInfo)}
          />
          <Input
            label="Phone"
            name="phone"
            value={userInfo?.phone}
            onChange={(e) => inputChangeHandler(e, setUserInfo)}
          />
          <Input
            label="Occupation"
            name="occupation"
            value={userInfo?.occupation}
            onChange={(e) => inputChangeHandler(e, setUserInfo)}
          />
          <Dropdown
            label="Gender"
            options={["Male", "Female"]}
            selected={gender}
            setSelected={setGender}
          />
          <Dropdown
            options={states}
            label="State"
            selected={state}
            setSelected={setState}
          />
          <Input
            label="Account Status"
            readOnly
            value={capitalize(userInfo?.status as string)}
          />
          <div className={classes.buttonSection}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleUpdateUserDetails();
              }}
              disabled={disableButton}
              loading={userRequestState?.isLoading}
            >
              Update
            </Button>
          </div>
        </form>
      )}
    </ProfileLayout>
  );
};

export default ProfileAccount;
