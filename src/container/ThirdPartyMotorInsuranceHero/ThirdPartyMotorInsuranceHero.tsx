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
          data?.plans?.map((data) => {
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
