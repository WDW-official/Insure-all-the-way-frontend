"use client";

import Button from "@/components/Button/Button";
import classes from "./IndividualAndFamilyHmoHero.module.css";
import ArrowRight from "@/assets/svgIcons/ArrowRight";
import Image from "next/image";
import { useRouter } from "next/navigation";

const IndividualAndFamilyHmoHero = () => {
  // Router
  const router = useRouter();

  return (
    <section className={classes.container}>
      <div>
        <h1>Individual & Family HMO Plans</h1>
        <p>
          Affordable and comprehensive health insurance designed for you and
          your loved ones. Enjoy seamless access to quality healthcare with
          flexible plans tailored to fit your needs.
        </p>
        <Button
          onClick={() => {
            router.push("#partners");
          }}
        >
          <span>Pick A Plan</span>
          <ArrowRight />
        </Button>
      </div>
      <div>
        <Image
          src="https://res.cloudinary.com/dfilepe0f/image/upload/v1739547123/Idividual_and_Family_HMO_tr4ixz.svg"
          width={500}
          height={500}
          alt="Hero Image"
        />
      </div>
    </section>
  );
};

export default IndividualAndFamilyHmoHero;
