"use client";

import classes from "./ProfileLayout.module.css";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { profileRoutes } from "@/utilities/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ProfileLayoutTypes = {
  children: React.ReactNode;
  className?: string;
};

const ProfileLayout = ({ children, className }: ProfileLayoutTypes) => {
  // ROuter
  const pathname = usePathname();

  return (
    <DashboardLayout className={classes.container}>
      <div className={classes.navSection}>
        {profileRoutes.map((data) => {
          return (
            <Link
              href={data?.route}
              key={data?.route}
              className={
                pathname.includes(data?.route) ? classes.active : undefined
              }
            >
              {data?.title}
            </Link>
          );
        })}
      </div>
      <div className={`${classes.main} ${className}`}>{children}</div>
    </DashboardLayout>
  );
};

export default ProfileLayout;
