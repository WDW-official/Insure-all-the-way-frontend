"use client";

import Image from "next/image";
import classes from "./HomeParters.module.css";
import { useEffect, useRef, useState } from "react";

const partnerLogos = [
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/AXA-Logo_rzdpth.svg",
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/staco-logo-2_hhyjib.svg",
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/NEM_logo-white-resized_korbgm.svg",
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/IEI_j1osku.svg",
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/coronation-300x33_w7ulin.svg",
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1757506841/korapayLogo_sylefp.png",
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1757506845/unileverLogo_is6a3c.svg",
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1757506839/medplusLogo_r7u5fr.webp",
];

const HomeParters = () => {
  // Utils
  const extendedLogos = [
    ...partnerLogos,
    ...partnerLogos,
    ...partnerLogos,
    ...partnerLogos,
    ...partnerLogos,
    ...partnerLogos,
    ...partnerLogos,
    ...partnerLogos,
    ...partnerLogos,
  ];

  // Refs
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollAmount = 0;
    const scrollSpeed = 1;

    const animate = () => {
      if (carousel) {
        carousel.scrollLeft += scrollSpeed;
        scrollAmount += scrollSpeed;

        if (scrollAmount >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
      requestAnimationFrame(animate);
    };

    animate(); // Start animation

    return () => cancelAnimationFrame(animate as any);
  }, []);

  return (
    <section className={classes.container}>
      <h4>We are Trusted By</h4>

      <div ref={carouselRef}>
        {extendedLogos.map((data, i) => (
          <Image
            src={data}
            alt="PArtner Logo"
            key={i}
            width={100}
            height={50}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeParters;
