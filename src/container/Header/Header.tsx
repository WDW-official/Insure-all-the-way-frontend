"use client";

import { headerRoutes, routes } from "@/utilities/routes";
import classes from "./Header.module.css";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { WandSparkles, X } from "lucide-react";
import { SESSION_STORAGE_BANNER_SEEN } from "@/utilities/constants";

interface Props {
  bannerMessage?: React.ReactNode;
}

const Header: React.FC<Props> = ({ bannerMessage }) => {
  // States
  const [navItemsState, setNavItemsState] = useState(headerRoutes);
  const [showBanner, setShowBanner] = useState(false);

  // Local
  const bannerMessageSeen = sessionStorage.getItem(SESSION_STORAGE_BANNER_SEEN);

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

  // Handlers
  const handleClearBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem(SESSION_STORAGE_BANNER_SEEN, "true");
  };

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

  useEffect(() => {
    if (bannerMessageSeen !== "true") {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [bannerMessageSeen]);

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
          }
          if (data?.properties?.includes("isAi" as string)) {
            return (
              <Link
                href={"#0"}
                onClick={() => {
                  activeToggler(i, navItemsState, setNavItemsState);
                }}
                className={`${data?.isActive ? classes.active : undefined} ${
                  classes["ai-link"]
                }`}
                key={i}
                title={"Comoing soon..."}
              >
                <span>{data?.title}</span>
                <WandSparkles size={16} />
              </Link>
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

      {showBanner && bannerMessage && (
        <div className={classes.banner}>
          <div>{bannerMessage}</div>
          <span>
            <X size={16} color="#000" onClick={handleClearBanner} />
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
