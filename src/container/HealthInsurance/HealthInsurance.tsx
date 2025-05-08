import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import classes from "./HealthInsurance.module.css";
import HealthInsuranceHero from "../HealthInsuranceHero/HealthInsuranceHero";
import InsuranceTypes from "@/components/InsuranceTypes/InsuranceTypes";
import { healthInsuranceTypes } from "@/utilities/motorInsurance";
import ContactUsBanner from "../ContactUsBanner/ContactUsBanner";
import Faqs from "../Faqs/Faqs";
import { healthInsuranceFaqs } from "@/utilities/faqs";

const HealthInsurance = () => {
  return (
    <ApppLayout>
      <HealthInsuranceHero />
      <InsuranceTypes data={healthInsuranceTypes} />
      <div className={classes.contact}>
        <ContactUsBanner
          title="Health Insurance"
          caption="Health is Wealth! Invest in yours today. Our health insurance policies come with added value offerings that you will love. Who doesn't want a free gym membership or a spa date?"
        />
      </div>
      <Faqs faqs={healthInsuranceFaqs} />
    </ApppLayout>
  );
};

export default HealthInsurance;
