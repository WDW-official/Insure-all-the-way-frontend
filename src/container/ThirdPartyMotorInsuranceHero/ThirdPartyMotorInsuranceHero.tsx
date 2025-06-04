import RateCard from "@/components/RateCard/RateCard";
import classes from "./ThirdPartyMotorInsuranceHero.module.css";
import {
  policySubtypeType,
  thirdPartyInsuranceFormType,
} from "@/utilities/types";
import Loader from "@/components/Loader/Loader";
import { Dispatch, SetStateAction } from "react";

type ThirdPartyMotorInsuranceHeroType = {
  data: policySubtypeType;
  loading: boolean;
  setData: Dispatch<SetStateAction<thirdPartyInsuranceFormType>>;
};

const colors = ["#a7c7e7", "#ababab", "#edd014", "#909090"];
const icons = [
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1749032425/Private_Car_akggam.svg",
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1749032425/Commercial_i4neo4.svg",
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1749032424/Motorcycle_ahdgi4.svg",
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1749032424/Commercial_Van_r4gjde.svg",
];

const ThirdPartyMotorInsuranceHero = ({
  data,
  loading,
  setData,
}: ThirdPartyMotorInsuranceHeroType) => {
  return (
    <section className={classes.container}>
      <h1>
        You are 5 minutes away from getting your{" "}
        <span> Third Party Motor Insurance!</span>
      </h1>
      <p>
        Stay covered against third-party damages, accidental death, and bodily
        injury with affordable plans tailored to your needs
      </p>

      <div className={classes.rateSection}>
        {loading ? (
          <Loader />
        ) : (
          data?.plans?.map((data, i) => {
            return (
              <RateCard
                title={data?.name}
                price={data?.price}
                features={data?.features}
                description={data?.description}
                onClick={() =>
                  setData((prevState) => {
                    return { ...prevState, product: data?.name };
                  })
                }
                key={data?.name}
                theme={colors[i] || "#000"}
                icon={icons[i]}
              />
            );
          })
        )}
      </div>

      <div></div>
      <div></div>
    </section>
  );
};

export default ThirdPartyMotorInsuranceHero;
