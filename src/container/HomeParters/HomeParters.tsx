"use client";

import Image from "next/image";
import classes from "./HomeParters.module.css";
import { useEffect, useRef } from "react";

interface Props {
  partnerLogos: string[];
  title?: string;
}

const HomeParters: React.FC<Props> = ({
  partnerLogos,
  title = "Our Partners",
}) => {
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
    let animationFrameId: number;

    const animate = () => {
      if (carousel) {
        carousel.scrollLeft += scrollSpeed;
        scrollAmount += scrollSpeed;

        if (scrollAmount >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className={classes.container}>
      <h4>{title}</h4>

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
