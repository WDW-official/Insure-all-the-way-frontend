import Link from "next/link";
import classes from "./BreadCrumbMenu.module.css";

type BreadCrumbMenuTypes = {
  routes: {
    title: string;
    route: string;
  }[];
};

const BreadCrumbMenu = ({ routes }: BreadCrumbMenuTypes) => {
  return (
    <ul className={classes.container}>
      {routes.map((data) => {
        return (
          <li>
            <Link href={data?.route}>{data?.title}</Link>
            <span>/</span>
          </li>
        );
      })}
    </ul>
  );
};

export default BreadCrumbMenu;
