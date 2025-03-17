"use client";

import Button from "@/components/Button/Button";
import classes from "./ComprehensiveMotorInsuranceHero.module.css";
import CheckCircle from "@/assets/svgIcons/CheckCircle";
import { useRouter } from "next/navigation";
import Image from "next/image";

const stepsInfo = [
  "Fill out the Comprehensive Motor Insurance Form and get a quote",
  "Make payment",
  "Complete our Insurance Proposal Form, and you are Insured All The Way!",
];

const ComprehensiveMotorInsuranceHero = () => {
  // Router
  const router = useRouter();
  return (
    <section className={classes.outerContainer}>
      <div className={classes.container}>
        <h1>
          Buy our <span>comprehensive</span> policy and get a gift and{" "}
          <span>added-value services</span> as a reward for your trust.
        </h1>

        {stepsInfo.map((data, i) => {
          return (
            <p key={i}>
              <CheckCircle />
              <span>{data}</span>
            </p>
          );
        })}

        <Button onClick={() => router.push("#insurance-form")}>Buy Now</Button>
      </div>
      <div>
        <Image
          src="https://res.cloudinary.com/dfilepe0f/image/upload/v1742229580/Comprehensive_Motor_Insurance_m2yyyh.svg"
          fill
          alt="Motor Insurance"
        />
      </div>
    </section>
  );
};

export default ComprehensiveMotorInsuranceHero;
