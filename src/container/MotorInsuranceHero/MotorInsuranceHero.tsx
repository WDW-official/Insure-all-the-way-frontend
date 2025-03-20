"use client";

import Button from "@/components/Button/Button";
import classes from "./MotorInsuranceHero.module.css";
import Image from "next/image";
import {
  MotorInsuranceHeroDecoration1,
  MotorInsuranceHeroDecoration2,
  MotorInsuranceHeroDecoration3,
} from "@/assets/svgIcons/MotorInsuranceHeroDecorations";
import Phone from "@/assets/svgIcons/Phone";
import Draft from "@/assets/svgIcons/Draft";
import { useRouter } from "next/navigation";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";

const MotorInsuranceHero = () => {
  // Router
  const router = useRouter();

  // Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  return (
    <section className={classes.container}>
      <div>
        <h1>
          Drive, <span>Protected</span>
        </h1>
        <h1>
          Drive, <span>Confidently.</span>
        </h1>
        <p>
          Get full protection against damage, floods, fire, and theft so you can
          drive worry-free!
        </p>

        <div className={classes.buttonSection}>
          <Button
            onClick={() => updateSearchParams("contact-us", "true", "set")}
          >
            <Phone />
            <span>Speak to an Agent</span>
          </Button>
          <Button type="null" onClick={() => router.push("#plans")}>
            <span>Choose a Plan </span>
            <Draft />
          </Button>
        </div>
      </div>

      <div>
        <Image
          src="https://res.cloudinary.com/dfilepe0f/image/upload/v1738947903/Car_Insurance_Hero_Image_t3gbim.svg"
          height={500}
          width={300}
          layout="responsive"
          alt="Motor Insurance"
        />
        <MotorInsuranceHeroDecoration1 />
        <MotorInsuranceHeroDecoration2 />
        <MotorInsuranceHeroDecoration3 />
      </div>
    </section>
  );
};

export default MotorInsuranceHero;
