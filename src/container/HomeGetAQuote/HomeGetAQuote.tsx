import { headerRoutes } from "@/utilities/routes";
import classes from "./HomeGetAQuote.module.css";
import InsuranceCard from "@/components/InsuranceCard/InsuranceCard";

const insuranceProducts = headerRoutes[0].children;
const colors = ["#edd014", "rgb(212, 47, 47)", "#717171"];

const HomeGetAQuote = () => {
  return (
    <section className={classes.container}>
      <h4>
        <hr />
        Get a Quote
        <hr />
      </h4>
      <p>Looking for hassle free insurance? Get a quote in just few clicks.</p>

      <div>
        {insuranceProducts?.map((data, i) => (
          <InsuranceCard
            title={data?.title}
            backgroundImage={data?.image}
            key={i}
            route={data?.route}
            color={colors[i]}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeGetAQuote;
