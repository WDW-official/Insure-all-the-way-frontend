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

const Homepage = () => {
  return (
    <ApppLayout>
      <HomeHero />
      <HomeStats />
      <HomeHowWeWork />
      <HomeParters />
      <ContactUsBanner />
      <HomeTestimonoals />
      <Faqs faqs={faqs.slice(0, 4)} />
    </ApppLayout>
  );
};

export default Homepage;
