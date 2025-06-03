import Image from "next/image";
import classes from "./HomeHowWeWork.module.css";
import Policy from "@/assets/svgIcons/Policy";
import RequestQuote from "@/assets/svgIcons/RequestQuote";
import SpeakWithRep from "@/assets/svgIcons/SpeakWithRep";
import Shield from "@/assets/svgIcons/Shield";
import Umbrella from "@/assets/svgIcons/Umbrella";

const howWeWorkList = [
  {
    title: "Choose a Policy",
    description: "Pick a policy that best suits your needs.",
    icon: <Shield />,
  },
  {
    title: "Get a Quote",
    description:
      "Use the quote calculator to get an instant estimate of your premium.",
    icon: <RequestQuote />,
  },
  {
    title: "Speak With a Rep",
    description:
      "Feel free to speak with a sales representative before you proceed.",
    icon: <SpeakWithRep />,
  },
  {
    title: "Get Covered",
    description: "Once payment has been made, your policy will be sent to you.",
    icon: <Umbrella />,
  },
];

const HomeHowWeWork = () => {
  return (
    <section className={classes.container}>
      <div>
        <h2>How It Works</h2>
        <h4>Get Covered In 4 Easy Steps</h4>
        <p>
          We’ve made getting insurance fast and hassle-free. Follow these four
          steps to secure your coverage today.
        </p>

        <Image
          src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1748956433/How_We_Work.svg_vegy3l.webp"
          alt="How we work"
          width={487}
          height={311}
        />
      </div>

      <div>
        {howWeWorkList?.map((data) => {
          return (
            <div key={data?.title}>
              <div>{data?.icon}</div>
              <div>
                <h4>{data?.title}</h4>
                <p>{data?.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeHowWeWork;
