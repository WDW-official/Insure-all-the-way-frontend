"use client";

import React, { useState, useRef, useEffect } from "react";
import classes from "./Dropdown.module.css";
import Loader from "../Loader/Loader";
import { CircularProgress } from "@mui/material";

export type DropdownProps = {
  title?: string | React.ReactNode;
  options: string[] | undefined;
  selected?: string | undefined | any;
  setSelected?: React.Dispatch<React.SetStateAction<string | undefined | any>>;
  isLoading?: boolean;
  label?: string;
  isRequired?: boolean;
  errorMessage?: string;
  onOpen?: () => void;
  maxHeight?: string;
  disabled?: boolean;
};

const Dropdown = (props: DropdownProps) => {
  const [isActive, setIsActive] = useState(false);
  const [keyPressedValue, setKEyPressedValue] = useState("");
  const [optionsState, setOptionsState] = useState<string[] | undefined>(
    props.options
  );
  const [invalid, setInvalid] = useState(false);

  // ref
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownItem = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.options) {
      setOptionsState(props.options);
    }
  }, [props.options]);

  useEffect(() => {
    if (searchInput && isActive) {
      searchInput.current?.focus();
    }
  }, [isActive]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const removeDropdownHandler = (e: any) => {
        if (dropdownRef && !dropdownRef?.current?.contains(e.target)) {
          setIsActive(false);
        } else {
        }
      };
      document.addEventListener("mousedown", removeDropdownHandler);

      return () => {
        document.removeEventListener("mousedown", removeDropdownHandler);
      };
    }
  }, []);

  useEffect(() => {
    const removeDropdownHandler = (e: any) => {
      if (dropdownRef && !dropdownRef?.current?.contains(e.target)) {
        setIsActive(false);
      } else {
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", removeDropdownHandler);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("mousedown", removeDropdownHandler);
      }
    };
  }, [props.selected, props.isRequired]);

  return (
    <div className={classes.container}>
      {props?.label && (
        <label htmlFor={props.label} className={classes.label}>
          {props.label} {props.isRequired && <span>*</span>}
        </label>
      )}

      <div
        className={`${classes.dropdown} ${
          invalid ? classes.invalid : classes.valid
        } ${isActive ? classes.active : classes.inActive}`}
        ref={dropdownRef}
      >
        <div
          // tabIndex={0}
          className={`${classes.dropdownButton} ${
            props.disabled ? classes.disabled : classes.abled
          }`}
          onClick={() => {
            setIsActive(!isActive);
            if (props.onOpen) {
              props.onOpen();
            }
          }}
          onBlur={() => {
            if (props.isRequired && !props?.selected && !isActive) {
              setInvalid(true);
            } else {
              setInvalid(false);
            }
          }}
          tabIndex={0}
          onKeyDown={(event) => {
            if (props.options && props?.options?.length > 8) {
              setKEyPressedValue(event.key);
              const optionsCopy =
                props.options &&
                props.options.filter((data) => {
                  return (
                    String(data?.toString().toLowerCase().charAt(0)) ===
                    event.key
                  );
                });
              setOptionsState(optionsCopy);
              if (event.key === "Backspace") {
                setOptionsState(props.options);
              }
            }
          }}
        >
          {props?.selected ||
            props?.title ||
            `Select ${props.label?.toLowerCase()}`}
          {props.isLoading ? (
            <CircularProgress
              size="1rem"
              color="inherit"
              style={{
                color: "#e5c300",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={
                isActive
                  ? { transform: "rotate(-90deg)" }
                  : { transform: "rotate(0deg)" }
              }
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="black"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        {isActive && (
          <div
            className={classes.dropdownContent}
            style={{ maxHeight: props.maxHeight || undefined }}
          >
            {props.options && props.options?.length > 8 && (
              <div className={classes.inputSection}>
                <input
                  type="text"
                  placeholder="Search"
                  value={keyPressedValue}
                  onChange={(e) => {
                    if (props?.options && props?.options?.length > 8) {
                      setKEyPressedValue(e.target.value);
                    }
                  }}
                  ref={searchInput}
                />
              </div>
            )}
            {optionsState && optionsState.length > 0 ? (
              optionsState
                ?.filter((option) => {
                  return keyPressedValue.toLowerCase() === "" ||
                    (props?.options && props?.options?.length <= 8)
                    ? String(option)
                    : String(option)
                        ?.toLowerCase()
                        ?.includes(keyPressedValue?.toLowerCase());
                })
                ?.map((option, i) => {
                  return (
                    <div
                      key={i}
                      className={classes.dropdownItem}
                      onClick={() => {
                        if (props.setSelected) props?.setSelected(option);
                        setIsActive(false);
                      }}
                      ref={dropdownItem}
                    >
                      {option}
                    </div>
                  );
                })
            ) : !props.isLoading &&
              props.options &&
              props.options.length === 0 ? (
              <p className={`${classes.dropdownItem2}`}>No matching Items</p>
            ) : (
              <div className={classes.loadingContainer}>
                <CircularProgress
                  size="3rem"
                  color="inherit"
                  style={{
                    color: "#e5c300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {invalid && (
        <div className={classes.errorMessage}>
          {props.errorMessage || "Please choose an option to continue"}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
