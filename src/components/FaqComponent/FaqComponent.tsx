"use client";

import React, { useState } from "react";
import classes from "./FaqComponent.module.css";
import Dash from "@/assets/svgIcons/Dash";
import Plus from "@/assets/svgIcons/Plus";

type FaqComponentTypes = {
  question: string;
  answer: string;
};

const FaqComponent = ({ question, answer }: FaqComponentTypes) => {
  // States
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={classes.container}>
      <div
        className={classes.question}
        onClick={() => {
          setIsActive((prevState) => !prevState);
        }}
      >
        <p>{question}</p>
        <div>{isActive ? <Dash /> : <Plus />}</div>
      </div>
      <div
        className={classes.answer}
        style={isActive ? { maxHeight: "700px" } : { maxHeight: "0px" }}
        dangerouslySetInnerHTML={{ __html: answer }}
      ></div>
    </div>
  );
};

export default FaqComponent;
