"use client";

import Image from "next/image";
import classes from "../IndividualAndFamilyHmoSections/IndividualAndFamilyHmoSections.module.css";
import { useEffect, useRef, useState } from "react";

const sections = [
  {
    title: "Stress-Free Signup",
    caption: "Quick & Easy: Sign up your entire company in minutes—no hassle!",
    image:
      "https://res.cloudinary.com/dfilepe0f/image/upload/v1739348786/hassle-free-white_nse8v7.png",
  },
  {
    title: "24/7 Availability",
    caption:
      "Round-the-Clock Support: Your employees can always rely on us, anytime, anywhere.",
    image:
      "https://res.cloudinary.com/dfilepe0f/image/upload/v1739348786/24-hours-white_ww0zqx.png",
  },
  {
    title: "Dedicated Account Manager",
    caption:
      "Personalized Support: Companies with 10+ employees get a dedicated account manager.",
    image:
      "https://res.cloudinary.com/dfilepe0f/image/upload/v1739348786/accountant-white_ddrtjm.png",
  },
  {
    title: "Affordable Health Insurance",
    caption:
      "Tailored Coverage: Our experts help you find the best plan within your budget.",
    image:
      "https://res.cloudinary.com/dfilepe0f/image/upload/v1739348786/naira-white_ctuhl9.png",
  },
];

const CorporateHmoFeatures = () => {
  // States
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  // Refs
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const updatedSections = new Set(prev);

          entries.forEach((entry) => {
            const index = sectionRefs.current.findIndex(
              (el) => el === entry.target
            );
            if (index !== -1) {
              if (entry.isIntersecting) {
                updatedSections.add(index); // Add if visible
              } else {
                updatedSections.delete(index); // Remove if out of view
              }
            }
          });

          return Array.from(updatedSections);
        });
      },
      { threshold: 0.9 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className={classes.container}>
      {sections.map((data, i) => {
        return (
          <div
            key={i}
            ref={(el) => (sectionRefs.current[i] = el) as any}
            className={`${classes[`corporate-${i + 1}`]} ${
              classes.sectionBox
            } ${visibleSections.includes(i) ? classes.visible : undefined}`}
          >
            <Image src={data?.image} width={85} height={85} alt={data?.title} />
            <div>
              <h4>{data?.title}</h4>
              <p>{data?.caption}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default CorporateHmoFeatures;
