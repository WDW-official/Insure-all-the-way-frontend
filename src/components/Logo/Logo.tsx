import { routes } from "@/utilities/routes";
import Link from "next/link";
import React from "react";
import logo from "../../assets/images/logo.png";
import Image from "next/image";
import classes from "./Logo.module.css";

type LogoTypes = {
  dimensions?: { width: number; height: number };
  url?: string;
};

const Logo = ({ dimensions, url }: LogoTypes) => {
  return (
    <Link
      href={routes.BASE_URL}
      className={classes.logo}
      style={{ width: dimensions?.width, height: dimensions?.height }}
    >
      <Image
        src={url || logo}
        alt="Insure All The Way Logo"
        width={dimensions?.width}
        height={dimensions?.height}
      />
    </Link>
  );
};

export default Logo;
