import Input from "@/components/Input/Input";
import classes from "./Faqs.module.css";
import Button from "@/components/Button/Button";
import FaqComponent from "@/components/FaqComponent/FaqComponent";
import { faqs } from "@/utilities/faqs";
import ArrowRight from "@/assets/svgIcons/ArrowRight";
import { faqType } from "@/utilities/types";

type FaqsTypes = {
  faqs: faqType[];
};

const Faqs = ({ faqs }: FaqsTypes) => {
  return (
    <section className={classes.container}>
      <div>
        {faqs?.map((data) => {
          return (
            <FaqComponent
              question={data?.question}
              answer={data?.answer}
              key={data?.question}
            />
          );
        })}
      </div>
      <div>
        <h4>How can we help you?</h4>
        <p>
          Follow our newsletter. We will regulary update our latest project and
          availability.
        </p>
        <div>
          <Input placeholder="Enter your Email" />
          <Button>Let's Talk</Button>
        </div>

        <Button type="null">
          <span>More FAQs</span>
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
};

export default Faqs;
