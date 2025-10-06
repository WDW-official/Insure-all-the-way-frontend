import { useState } from "react";
import classes from "./SideNav.module.css";
import { headerRoutes } from "@/utilities/routes";
import { activeToggler } from "@/helpers/activeHandlers";
import ArrowDown from "@/assets/svgIcons/ArrowDown";
import Link from "next/link";
import Close from "@/assets/svgIcons/Close";
import { routes } from "@/utilities/routes";
import Button from "@/components/Button/Button";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo/Logo";

type SidenavTypes = {
  onClose: () => void;
};

const Sidenav = ({ onClose }: SidenavTypes) => {
  // States
  const [navItems, setNavItems] = useState(headerRoutes);

  //   Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  // Router
  const router = useRouter();

  return (
    <section className={classes.container}>
      <div>
        <Logo
          url="https://res.cloudinary.com/dx3zrhslt/image/upload/v1759762395/IATW_New_Logo_1_c41qxd.svg"
          dimensions={{ width: 40, height: 40 }}
        />
        <p>Your satisfaction is our priority</p>
        <Close onClick={onClose} />
      </div>
      {/* <div>
        <Close onClick={onClose} />
      </div> */}
      <nav>
        {navItems?.map((route, i) => {
          if (route.children) {
            return (
              <div className={classes.moreOptions} key={i}>
                <div onClick={() => activeToggler(i, navItems, setNavItems)}>
                  <span>{route?.title}</span>
                  <ArrowDown />
                </div>

                <div
                  className={classes.children}
                  style={
                    route?.isActive
                      ? { maxHeight: "2000px" }
                      : { maxHeight: "0px" }
                  }
                >
                  {route?.children?.map((data, j) => {
                    if ((data?.children?.length as number) > 0) {
                      return (
                        <div
                          className={classes.moreOptions}
                          key={j}
                          onClick={(e) => {
                            setNavItems((prevState) => {
                              const updatedState = [...prevState];
                              if (
                                updatedState[i]?.children &&
                                (updatedState as any)[i]?.children[j]
                              ) {
                                (updatedState as any)[i].children[j].isActive =
                                  !(updatedState as any)[i].children[j]
                                    .isActive;
                              }

                              return updatedState;
                            });
                          }}
                        >
                          <span>{data?.icon}</span>
                          <span
                            onClick={() => {
                              router.push(`${data?.route}`);
                            }}
                          >
                            {data?.title}
                          </span>
                          <ArrowDown />

                          <div
                            className={classes.children}
                            style={
                              !data?.isActive
                                ? { maxHeight: "2000px" }
                                : { maxHeight: "0px" }
                            }
                          >
                            {data?.children?.map((datum, k) => {
                              return (
                                <Link
                                  href={`${data?.route}${datum?.route}`}
                                  key={k}
                                >
                                  {datum?.title}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <Link href={data?.route} key={j}>
                        {data?.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }
          return (
            <Link key={i} href={route?.route}>
              {route?.title}
            </Link>
          );
        })}
      </nav>

      <Button
        onClick={() => {
          updateSearchParams("auth", "sign-in", "set");
        }}
        type="secondary"
      >
        Sign In
      </Button>
    </section>
  );
};

export default Sidenav;
