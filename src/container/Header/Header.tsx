"use client";

import { headerRoutes, routes } from "@/utilities/routes";
import classes from "./Header.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ArrowDown from "@/assets/svgIcons/ArrowDown";
import Button from "@/components/Button/Button";
import { activeToggler } from "@/helpers/activeHandlers";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import Logo from "@/components/Logo/Logo";
import Hamburger from "@/assets/svgIcons/Hamburger";
import Sidenav from "../SideNav/SideNav";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Header = () => {
  // States
  const [navItemsState, setNavItemsState] = useState(headerRoutes);

  // Router
  const router = useRouter();

  // Context
  const { requestState, user } = useContext(AuthContext);

  // Refs
  const headerDropdownRef = useRef<HTMLDivElement | null>(null);
  const sideNavRef = useRef<HTMLDivElement | null>(null);

  // Utils
  const activeNavItem = navItemsState?.find((data) => data?.isActive);
  const handleSidenavOpen = () => {
    if (sideNavRef?.current) {
      sideNavRef.current.style.width = "100vw";
      sideNavRef.current.style.height = "100vh";
    }
  };

  const handleSidenavClose = () => {
    if (sideNavRef?.current) {
      sideNavRef.current.style.width = "0%";
      sideNavRef.current.style.height = "0%";
    }
  };

  // Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  // Effects
  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const removeChildrenHandler = (e: any) => {
        if (
          headerDropdownRef?.current &&
          !headerDropdownRef?.current?.contains(e?.target)
        ) {
          setNavItemsState((prevState) => {
            return prevState?.map((data) => {
              return { ...data, isActive: false };
            });
          });
        }
      };

      document.addEventListener("mousedown", removeChildrenHandler);

      return () => {
        document.removeEventListener("mousedown", removeChildrenHandler);
      };
    }
  }, []);

  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    setVisible(currentScrollPos < prevScrollPos || currentScrollPos < 50);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <header
      className={`${classes.container} ${
        visible ? classes.visible : classes.hidden
      }`}
    >
      <Logo />

      <nav>
        {navItemsState?.map((data, i) => {
          if ((data?.children?.length as number) > 0) {
            return (
              <div
                onClick={() => {
                  activeToggler(i, navItemsState, setNavItemsState);
                }}
                className={data?.isActive ? classes.active : undefined}
                key={i}
              >
                <span>{data?.title}</span>
                <ArrowDown />
              </div>
            );
          } else {
            return (
              <Link href={data?.route as string} key={i}>
                {data?.title}
              </Link>
            );
          }
        })}
      </nav>

      <div className={classes.buttonSection}>
        <Button
          onClick={() => {
            if (!user) {
              updateSearchParams("auth", "sign-in", "set");
            } else {
              router.push(routes.DASHBOARD);
            }
          }}
          loading={requestState?.isLoading}
          type="secondary"
        >
          {!user ? "Sign in" : "Dashboard"}
        </Button>
      </div>

      <div
        className={classes.children}
        style={activeNavItem ? { maxHeight: "1000px" } : { maxHeight: "0px" }}
        ref={headerDropdownRef}
      >
        {activeNavItem?.component}
      </div>

      <div className={classes.hamburger}>
        <Hamburger onClick={handleSidenavOpen} />
      </div>

      <div className={classes.sidenav} ref={sideNavRef}>
        <Sidenav onClose={handleSidenavClose} />
      </div>
    </header>
  );
};

export default Header;
