"use client";

import Button from "@/components/Button/Button";
import classes from "./ComprehensiveMotorInsuranceHero.module.css";
import CheckCircle from "@/assets/svgIcons/CheckCircle";
import { useRouter } from "next/navigation";
import Image from "next/image";

const stepsInfo = [
  "<span><b>Get a Quote</b>: Fill out the form in minutes</span>",
  "<span><b>Make Payment</b>: Secure and seamless</span>",
  "<span><b>You're Insured! </b></span>Plus, enjoy exclusive gifts & added services.",
];

const ComprehensiveMotorInsuranceHero = () => {
  // Router
  const router = useRouter();
  return (
    <section className={classes.outerContainer}>
      <div className={classes.container}>
        <h1>
          <span>Comprehensive Vehicle Insurance</span> & Exclusive Rewards
        </h1>

        {stepsInfo.map((data, i) => {
          return (
            <p key={i}>
              <CheckCircle />
              <span dangerouslySetInnerHTML={{ __html: data }}></span>
            </p>
          );
        })}

        <Button onClick={() => router.push("#insurance-form")}>Buy Now</Button>
      </div>
      <div>
        <Image
          src="https://res.cloudinary.com/dfilepe0f/image/upload/v1742314773/Comprehensive_Motor_Insurance_fgtv0s.svg"
          fill
          alt="Motor Insurance"
        />
      </div>
    </section>
  );
};

export default ComprehensiveMotorInsuranceHero;
