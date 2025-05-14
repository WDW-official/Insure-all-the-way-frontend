"use client";

import Button from "@/components/Button/Button";
import classes from "../BuildingHero/BuildingHero.module.css";
import ArrowRight from "@/assets/svgIcons/ArrowRight";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AllRiskHero = () => {
  // ROuter
  const router = useRouter();
  return (
    <section className={classes.container}>
      <div>
        <h1>
          <span>All Risks Insurance:</span> Comprehensive protection for your
          assets
        </h1>
        <p>
          All Risks Insurance provides extensive coverage for loss or damage to
          your insured property due to unforeseen events except those
          specifically excluded.
        </p>
        <p>
          Unlike standard policies, it offers broader protection against risks
          like theft, fire, and accidental damage, giving you peace of mind in
          every situation.
        </p>
        <p>
          <b>Stay Covered, Stay Secure!</b>
        </p>
        <Button onClick={() => router.push("#insurance-form")}>
          <span>Buy Now</span>
          <ArrowRight />
        </Button>
      </div>
      <div>
        <Image
          src="https://res.cloudinary.com/dfilepe0f/image/upload/v1741190843/All_Risks_PI_usiyes.svg"
          width={500}
          height={500}
          alt="Hero Image"
        />
      </div>
    </section>
  );
};

export default AllRiskHero;
