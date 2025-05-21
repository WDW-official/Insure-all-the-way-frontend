"use client";

import Image from "next/image";
import classes from "./HomeHero.module.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Phone from "@/assets/svgIcons/Phone";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { routes } from "@/utilities/routes";
import { useRouter } from "next/navigation";

const HomeHero = () => {
  // Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  // Router
  const router = useRouter();

  // Utils
  const images = [
    {
      image:
        "https://res.cloudinary.com/dx3zrhslt/image/upload/v1747821292/Health_1a_avxdio.svg",
      route: routes.HEALTH_INSURANCE,
      title: "Health Insurance",
      isMobile: false,
    },
    {
      image:
        "https://res.cloudinary.com/dx3zrhslt/image/upload/v1747821341/Motor_1a_vfnyka.svg",
      route: routes.MOTOR_INSURANCE,
      title: "Motor Insurance",
      isMobile: false,
    },
    {
      image:
        "https://res.cloudinary.com/dx3zrhslt/image/upload/v1747821318/All_Risk_1a._yezf1n.svg",
      route: routes.PROPERTY_INSURANCE,
      title: "Property Insurance",
      isMobile: false,
    },
  ];

  return (
    <section className={classes.container}>
      <div>
        <h1>
          Welcome to the <span> future of insurance.</span>
        </h1>
        <p>
          We harness innovative technology and value added services to simplify
          the way you purchase, claim, and renew your coverage.
        </p>
        <p>
          <b>Insure All The Way</b>, your satisfaction is our priority!
        </p>

        <Button onClick={() => updateSearchParams("contact-us", "true", "set")}>
          <Phone />
          <span>Speak to an Agent</span>
        </Button>
      </div>
      <div className={classes.imageSection}>
        {images.map((data, i) => {
          return (
            <div>
              <Image
                src={data?.image}
                alt={data?.title}
                key={data?.title}
                width={100}
                height={200}
              />
              <Button
                onClick={() => router.push(data.route)}
                type={i % 2 ? "primary" : "grey"}
              >
                Buy Now
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeHero;
