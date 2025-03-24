"use client";

import RateCard from "@/components/RateCard/RateCard";
import classes from "./EnhancedThirdPartyMotorInsuranceHero.module.css";
import {
  enhancedThirdPartyInsuranceFormTypes,
  policySubtypeType,
} from "@/utilities/types";
import Loader from "@/components/Loader/Loader";
import { Dispatch, SetStateAction } from "react";
import { requestHandler } from "@/helpers/requestHandler";

type EnhancedThirdPartyMotorInsuranceHeroType = {
  data: policySubtypeType;
  loading: boolean;
  setData: Dispatch<SetStateAction<enhancedThirdPartyInsuranceFormTypes>>;
};

const EnhancedThirdPartyMotorInsuranceHero = ({
  data,
  loading,
  setData,
}: EnhancedThirdPartyMotorInsuranceHeroType) => {
  return (
    <section className={classes.container}>
      <h1>
        You are 15 minutes away from getting your{" "}
        <span> Enhanced Third Party Motor Insurance!</span>
      </h1>
      <p>
        This insurance policy protects you from any damage or liability you
        cause to a third party, including accidental death or bodily injury.
      </p>

      <div className={classes.rateSection}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {data?.plans?.map((plan, i) => {
              return (
                <RateCard
                  title={plan?.name}
                  price={plan?.price}
                  features={plan?.features}
                  description={plan?.description}
                  onClick={() => {
                    setData((prevState) => {
                      return { ...prevState, plan: plan?.name };
                    });
                  }}
                  key={i}
                />
              );
            })}
          </>
        )}
      </div>

      <div></div>
      <div></div>
    </section>
  );
};

export default EnhancedThirdPartyMotorInsuranceHero;
