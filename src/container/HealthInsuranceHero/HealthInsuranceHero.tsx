"use client";

import Button from "@/components/Button/Button";
import Image from "next/image";
import {
  MotorInsuranceHeroDecoration1,
  MotorInsuranceHeroDecoration2,
  MotorInsuranceHeroDecoration3,
} from "@/assets/svgIcons/MotorInsuranceHeroDecorations";
import classes from "../MotorInsuranceHero/MotorInsuranceHero.module.css";
import Phone from "@/assets/svgIcons/Phone";
import Draft from "@/assets/svgIcons/Draft";
import { useRouter } from "next/navigation";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";

const HealthInsuranceHero = () => {
  // ROuter
  const router = useRouter();

  // Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  return (
    <section className={classes.container}>
      <div>
        <h1>
          Health is wealth{" "}
          <span className={classes.block}>invest in yours today.</span>
        </h1>
        <p>
          Cover your family from uncertainity with reliable health insurance.
        </p>

        <div className={classes.buttonSection}>
          <Button
            onClick={() => {
              updateSearchParams("contact-us", "true", "set");
            }}
          >
            <Phone />
            <span>Speak to an Agent</span>
          </Button>
          <Button type="null" onClick={() => router.push("#types")}>
            <span>Choose a Plan </span>
            <Draft />
          </Button>
        </div>
      </div>

      <div>
        <Image
          src="https://res.cloudinary.com/dfilepe0f/image/upload/v1738947903/Health_Insurance_Hero_Image_txsl9f.svg"
          height={500}
          width={300}
          alt="Motor Insurance"
        />
        <MotorInsuranceHeroDecoration1 color="#a7c7e7" />
        <MotorInsuranceHeroDecoration2 color="#a7c7e7" />
        <MotorInsuranceHeroDecoration3 color="#a7c7e7" />
      </div>
    </section>
  );
};

export default HealthInsuranceHero;
