import AllRiskForm from "../AllRiskForm/AllRiskForm";
import AllRiskHero from "../AllRiskHero/AllRiskHero";
import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import Faqs from "../Faqs/Faqs";
import { allRiskInsuranceFaqs } from "@/utilities/faqs";

const AllRisk = () => {
  return (
    <ApppLayout>
      <AllRiskHero />;
      <Faqs faqs={allRiskInsuranceFaqs} />
      <AllRiskForm />
    </ApppLayout>
  );
};

export default AllRisk;
