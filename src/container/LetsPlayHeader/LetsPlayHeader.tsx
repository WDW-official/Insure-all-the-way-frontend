import { headerRoutes, routes } from "@/utilities/routes";
import classes from "./LetsPlayHeader.module.css";
import Link from "next/link";

const LetsPlayHeader = () => {
  return (
    <section className={classes.container}>
      <h2>Let's Play</h2>

      <div className={classes.productsSection}>
        {headerRoutes[1].children?.map((datum, i) => {
          return (
            <div key={i}>
              <Link href={`${datum.route as string}`}>
                <div>
                  <span>{datum?.icon}</span>
                </div>
                <div>
                  <h5>{datum?.title}</h5>
                  <p>{datum?.description}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LetsPlayHeader;
