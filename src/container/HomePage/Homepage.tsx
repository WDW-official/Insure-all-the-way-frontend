import React from "react";
import HomeHero from "../HomeHero/HomeHero";
import ApppLayout from "@/layouts/ApppLayout/ApppLayout";
import HomeStats from "../HomeStats/HomeStats";
import HomeHowWeWork from "../HomeHowWeWork/HomeHowWeWork";
import HomeParters from "../HomeParters/HomeParters";
import ContactUsBanner from "../ContactUsBanner/ContactUsBanner";
import HomeTestimonoals from "../HomeTestimonoals/HomeTestimonoals";
import Faqs from "../Faqs/Faqs";
import { faqs } from "@/utilities/faqs";
import HomeReminder from "../HomeReminder/HomeReminder";
import Link from "next/link";

const partnerLogos = [
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/AXA-Logo_rzdpth.svg",
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/staco-logo-2_hhyjib.svg",
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/NEM_logo-white-resized_korbgm.svg",
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/IEI_j1osku.svg",
  "https://res.cloudinary.com/dfilepe0f/image/upload/v1739176279/coronation-300x33_w7ulin.svg",
];

const trustedByLogos = [
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1757506841/korapayLogo_sylefp.png",
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1757506845/unileverLogo_is6a3c.svg",
  "https://res.cloudinary.com/dx3zrhslt/image/upload/v1757506839/medplusLogo_r7u5fr.webp",
];

const Homepage = () => {
  return (
    <ApppLayout>
      <HomeHero />
      <HomeStats />
      <HomeHowWeWork />
      <HomeParters partnerLogos={partnerLogos} />
      <ContactUsBanner />
      <HomeParters partnerLogos={trustedByLogos} title="We Are Trusted By" />
      <HomeReminder />
      <HomeTestimonoals />
      <Faqs faqs={faqs.slice(0, 4)} />
    </ApppLayout>
  );
};

export default Homepage;
