"use client";

import Image from "next/image";
import classes from "./HomeHero.module.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Phone from "@/assets/svgIcons/Phone";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";

const HomeHero = () => {
  // Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  return (
    <section className={classes.container}>
      <div>
        <h1>
          Welcome to the <span> future of insurance.</span>
        </h1>
        <p>
          We harness innovative technology and value added services to simplify
          the way you buy, manage, and claim your coverage.
        </p>
        <p>
          <b>Insure All The Way</b>, your satisfaction is our priority!
        </p>

        <Button onClick={() => updateSearchParams("contact-us", "true", "set")}>
          <Phone />
          <span>Speak to an Agent</span>
        </Button>
      </div>
      <div>
        <Image
          src={
            "https://res.cloudinary.com/dfilepe0f/image/upload/v1741163614/IATW_Sub-banner_c4fzvf.svg"
          }
          alt="Hero Image"
          width={500}
          height={500}
        />
      </div>
    </section>
  );
};

export default HomeHero;
