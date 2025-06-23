"use client";

import Logo from "@/components/Logo/Logo";
import classes from "./DashboardHeader.module.css";
import User from "@/assets/svgIcons/User";
import { dashboardRoutes, routes } from "@/utilities/routes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logout from "@/assets/svgIcons/Logout";
import { useContext, useEffect, useRef, useState } from "react";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import { modalGenericType } from "@/utilities/types";
import LogoutModalBody from "../LogoutModalBody/LogoutModalBody";
import { AuthContext } from "@/context/AuthContext";

const DashboardHeader = () => {
  // Router
  const pathname = usePathname();
  const router = useRouter();

  // States
  const [showOptions, setShowOptions] = useState(false);
  const [modals, setModals] = useState<modalGenericType>({
    logout: false,
  });

  // Context
  const { logout } = useContext(AuthContext);

  // ref
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOptionsRemoveHandler = (e: any) => {
        if (
          containerRef?.current &&
          !containerRef?.current?.contains(e.target)
        ) {
          setShowOptions(false);
        }
      };

      document.addEventListener("mousedown", handleOptionsRemoveHandler);

      return () => {
        document.removeEventListener("mousedown", handleOptionsRemoveHandler);
      };
    }
  }, []);

  return (
    <>
      {modals?.logout && (
        <Modal
          body={
            <LogoutModalBody
              onClose={() => {
                setAllModalsFalse(setModals);
              }}
              onLogout={() => {
                logout();
              }}
            />
          }
          onClick={() => {
            setAllModalsFalse(setModals);
          }}
        />
      )}
      <header className={classes.container} ref={containerRef}>
        <Logo />

        <nav>
          {dashboardRoutes?.map((data, i) => {
            return (
              <Link
                className={
                  pathname.includes(data?.route)
                    ? classes.active
                    : classes.inActive
                }
                href={data?.route}
                key={data?.route}
              >
                {data?.title}
              </Link>
            );
          })}
        </nav>

        <div>
          <User
            color="#909090"
            onClick={() => setShowOptions((prevState) => !prevState)}
          />

          {showOptions && (
            <div className={classes.headerDropdown}>
              <div
                onClick={() => {
                  router.push(routes.PROFILE);
                }}
              >
                <User />
                <span>Profile Information</span>
              </div>

              <div onClick={() => setModalTrue(setModals, "logout")}>
                <Logout />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;

// "hidden lg:flex items-center justify-between gap-4 h-[70px] sticky top-0 bg-white z-20
// className="flex items-center gap-1 p-2 rounded-[500px] bg-grey-100"
// py-2 px-4 rounded-[54px] font-main text-sm
// "bg-white shadow-100 text-blue-100 font-bold"
//  "font-normal text-grey-200 "
