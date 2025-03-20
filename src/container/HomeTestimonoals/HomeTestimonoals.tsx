"use client";

import ArrowForward from "@/assets/svgIcons/ArrowForward";
import classes from "./HomeTestimonoals.module.css";
import ArrowBack from "@/assets/svgIcons/ArrowBack";
import { useEffect, useRef, useState } from "react";
import TesimonialCard from "@/components/TesimonialCard/TesimonialCard";
import { testimonials } from "@/utilities/testimonials";

const HomeTestimonoals = () => {
  // States
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Utils
  const scrollAmount = 200;

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setIsAtStart(container.scrollLeft === 0);
      setIsAtEnd(
        container.scrollLeft + container.clientWidth >= container.scrollWidth
      );
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Effects
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
    }

    return () => {
      if (container)
        container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={classes.container}>
      <div className={classes.header}>
        <h4>What Our Clients Say About Us...</h4>

        <div
          className={isAtStart ? classes?.inActive : classes?.active}
          onClick={scrollLeft}
        >
          <ArrowBack isActive={!isAtStart} />
        </div>
        <div
          className={isAtEnd ? classes?.inActive : classes?.active}
          onClick={scrollRight}
        >
          <ArrowForward isActive={!isAtEnd} />
        </div>
      </div>

      <div className={classes.testimonials} ref={scrollContainerRef}>
        {testimonials.map((data) => {
          return (
            <TesimonialCard
              name={data?.name}
              role="Customer"
              comment={data?.comment}
              key={data?.name}
            />
          );
        })}
      </div>
    </section>
  );
};

export default HomeTestimonoals;
