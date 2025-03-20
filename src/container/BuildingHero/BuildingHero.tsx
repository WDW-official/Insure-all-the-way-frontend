"use client";

import Button from "@/components/Button/Button";
import classes from "./BuildingHero.module.css";
import ArrowRight from "@/assets/svgIcons/ArrowRight";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BuildingHero = () => {
  // Router
  const router = useRouter();
  return (
    <section className={classes.container}>
      <div>
        <h1>Protect Your Building, Secure Your Investment</h1>
        <p>
          Building insurance safeguards the structure of your property covering
          walls, roofs, and permanent fixtures against risks like fire, storms,
          and vandalism.
        </p>
        <p>
          With the right coverage, you can repair or rebuild without financial
          strain. However, for added protection, consider separate insurance for
          your belongings inside.
        </p>
        <p>
          <b>Get Covered Today!</b>
        </p>
        <Button onClick={() => router.push("#insurance-form")}>
          <span>Book Now</span>
          <ArrowRight />
        </Button>
      </div>
      <div>
        <Image
          src="https://res.cloudinary.com/dfilepe0f/image/upload/v1741178154/Building_PI_xttlo9.svg"
          width={500}
          height={500}
          alt="Hero Image"
        />
      </div>
    </section>
  );
};

export default BuildingHero;
