"use client";

import classes from "./FileUploadInput.module.css";
import upload from "../../assets/images/upload.svg";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import Close from "@/assets/svgIcons/Close";

type FileUploadInputTypes = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  title: string;
  id?: string;
  accept?: string;
  notShowFiles?: boolean;
};

const FileUploadInput = ({
  files,
  setFiles,
  title,
  id,
  accept,
  notShowFiles,
}: FileUploadInputTypes) => {
  // States
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Utils

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
      e.dataTransfer.clearData();
    }

    setIsDraggingOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const filterFiles = (name: string) => {
    const filteredFiles = files?.filter((data) => {
      return data?.name !== name;
    });
    setFiles(filteredFiles);
  };

  return (
    <div className={classes.container}>
      <p>{title}</p>
      <div
        className={classes.uploadContainer}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={
          isDraggingOver
            ? { border: "2px dashed #fdd602" }
            : { border: "1px solid #eaeaea" }
        }
      >
        <Image src={upload} alt="Upload" />

        <h4>
          Drag and drop files or <label htmlFor={id || "file"}>Browse</label>
        </h4>

        <input
          type="file"
          id={id || "file"}
          accept={accept}
          onChange={handleFileChange}
        />

        <p>Supported formates: JPEG, PNG</p>
      </div>

      {!notShowFiles && files?.length > 0 && (
        <div className={classes.uploaded}>
          <h4>Uploaded File</h4>

          {files?.map((data, i) => {
            return (
              <div key={i}>
                <span>{data?.name}</span>
                <Close onClick={() => filterFiles(data?.name)} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUploadInput;
