import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import classes from "./HealthClaimsForm.module.css";
import {
  claimsDataType,
  requestType,
  userPoliciesType,
} from "@/utilities/types";
import Close from "@/assets/svgIcons/Close";
import Phone from "@/assets/svgIcons/Phone";
import Button from "@/components/Button/Button";
import { areAllValuesFilled } from "@/helpers/validateObjectValues";
import Draft from "@/assets/svgIcons/Draft";
import Input from "@/components/Input/Input";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import FileUploadInput from "@/components/FileUploadInput/FileUploadInput";
import moment from "moment";
import TextArea from "@/components/Textarea/TextArea";

type HealthClaimFormType = {
  onClose: () => void;
  data: userPoliciesType;
  claimsData: claimsDataType;
  setClaimsData: Dispatch<SetStateAction<claimsDataType>>;
  claimsHandler: () => void;
  requestState: requestType;
};

const HealthClaimsForm = ({
  onClose,
  data,
  claimsData,
  setClaimsData,
  claimsHandler,
  requestState,
}: HealthClaimFormType) => {
  // States
  const [files, setFiles] = useState<File[]>([]);
  const [filesNum, setFilesNum] = useState<number[]>([]);

  // Utils
  const minDate = moment().subtract(30, "days").format("YYYY-MM-DDTHH:mm");
  const maxDate = moment().format("YYYY-MM-DDTHH:mm");

  //   Effects
  useEffect(() => {
    setClaimsData((prevState) => {
      return { ...prevState, attachments: files };
    });
  }, [files]);

  return (
    <div className={classes.container}>
      <h4>Health Claims Form</h4>
      <p>Please fill the form below so we can serve you better</p>
      <Close onClick={onClose} />
      <form action="">
        <Input
          label="Date and Time of Occurence"
          type="datetime-local"
          value={claimsData?.dateAndTime}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="dateAndTime"
          min={minDate}
          max={maxDate}
          isRequired
        />

        <TextArea
          label="Provide the circumstances of loss or damage"
          placeholder="Type here..."
          value={claimsData?.narration}
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          name="narration"
          isRequired
        />

        <Input
          label="Enrolee ID"
          placeholder="Enter your enrolment ID"
          isRequired
          name="enroleeId"
          onChange={(e) => inputChangeHandler(e, setClaimsData)}
          value={claimsData?.enroleeId}
        />

        {files?.length > 0 ? (
          <div className={classes.files}>
            <h4>Files (five maximum)</h4>
            {files?.map((data, i) => {
              return (
                <div key={i} className={classes.fileName}>
                  <span>{data?.name}</span>
                  <Close
                    onClick={() => {
                      setFiles((prevState) => {
                        return prevState?.filter((_, j) => {
                          return j !== i;
                        });
                      });
                      setFilesNum((prevState) => {
                        return prevState?.filter((_, j) => {
                          return j !== i;
                        });
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : null}

        {filesNum?.map((data, i) => {
          if (data === files.length) {
            return (
              <FileUploadInput
                files={files}
                setFiles={setFiles}
                title="Upload Documents"
                accept=".pdf"
                notShowFiles
                key={i}
              />
            );
          } else return null;
        })}

        <Button
          type="null"
          onClick={(e) => {
            e.preventDefault();
            setFilesNum((prevState) => {
              if (prevState?.length) {
                return [...prevState, prevState[prevState.length - 1] + 1];
              } else {
                return [0];
              }
            });
          }}
          disabled={files?.length >= 5 || !claimsData?.enroleeId}
        >
          Upload a new file
        </Button>

        <div className={classes.buttonSection}>
          <a
            href={`tel:${data?.agent?.phone}`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Phone />
            <span>Call your Agent</span>
          </a>
          <Button
            disabled={
              !claimsData?.enroleeId ||
              !claimsData?.attachments ||
              (claimsData?.attachments?.length as number) < 1 ||
              !claimsData?.dateAndTime ||
              !claimsData?.narration
            }
            onClick={(e) => {
              e.preventDefault();
              claimsHandler();
            }}
            loading={requestState?.isLoading}
          >
            <Draft />
            <span>Submit Your Claim</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HealthClaimsForm;
