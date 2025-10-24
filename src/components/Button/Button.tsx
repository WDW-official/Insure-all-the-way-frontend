import { CircularProgress } from "@mui/material";
import classes from "./Button.module.css";
import React, { CSSProperties, HTMLAttributes } from "react";

type ButtonPropTypes = HTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  type?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "null"
    | "invalid"
    | "yellow"
    | "bordered"
    | "delete"
    | "grey";
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  icon?: React.ReactNode;
  id?: string;
  style?: CSSProperties;
};

const Button = ({
  children,
  type,
  disabled,
  onClick,
  loading,
  className,
  icon,
  id,
  style,
  ...props
}: ButtonPropTypes) => {
  return (
    <button
      {...props}
      className={`${classes.button} ${
        type === "secondary"
          ? classes.secondary
          : type === "tertiary"
          ? classes.tertiary
          : type === "null"
          ? classes.null
          : type === "invalid"
          ? classes.invalid
          : type === "bordered"
          ? classes.bordered
          : type === "delete"
          ? classes.delete
          : type === "grey"
          ? classes.grey
          : classes.primary
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      id={id}
      style={style}
    >
      {loading ? (
        <CircularProgress
          size="1rem"
          color="inherit"
          style={{ color: "#000" }}
        />
      ) : (
        children
      )}
      {icon && <span className={classes.icon}>{icon}</span>}
    </button>
  );
};

export default Button;
