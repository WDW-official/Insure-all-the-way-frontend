"use client";

import Image from "next/image";
import classes from "./IndividualAndFamilyHmoAbout.module.css";
import Button from "@/components/Button/Button";
import ArrowDown from "@/assets/svgIcons/ArrowDown";
import ArrowHeadDown from "@/assets/svgIcons/ArrowHeadDown";
import { useRouter } from "next/navigation";

const IndividualAndFamilyHmoAbout = () => {
  // Router
  const router = useRouter();

  return (
    <section className={classes.outerContainer}>
      <div className={classes.container}>
        <div>
          <Image
            src="https://res.cloudinary.com/dfilepe0f/image/upload/v1739547124/Patient-centered_Care_i3pae7.svg"
            width={540}
            height={600}
            alt="About"
          />
          <Image
            src="https://res.cloudinary.com/dfilepe0f/image/upload/v1739284422/imageDecor_pb4fc6.svg"
            width={204}
            height={204}
            alt="About"
          />
        </div>
        <div>
          <div className={classes.header}>
            <p>HMO Plan Recommendation</p>
            <h4>
              Need Help Choosing the
              <br />
              Right HMO Plan?
            </h4>
          </div>

          <p>
            Finding the perfect health insurance plan can feel overwhelming, but
            we’re here to help! Tell us about your healthcare needs, budget, and
            lifestyle, and we’ll recommend a plan that fits you and your family.
          </p>
          <p>
            Let us guide you toward an HMO plan that truly suits your needs,
            because quality healthcare should be straightforward and
            stress-free.
          </p>

          <Button
            onClick={() => {
              router.push("#recommendation-form");
            }}
          >
            <span>Recommend Plan</span>
            <ArrowHeadDown />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default IndividualAndFamilyHmoAbout;
