"use client";

import HandShake from "@/assets/svgIcons/HandShake";
import classes from "./HomeStats.module.css";
import Reward from "@/assets/svgIcons/Reward";
import rightArrow from "../../assets/images/right-arrow.svg";
import stopWatch from "../../assets/images/stopwatch.svg";
import uploadFile from "../../assets/images/upload-file.svg";
import Image from "next/image";
import Automation from "@/assets/svgIcons/Automation";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import { modalGenericType } from "@/utilities/types";
import HomeStatsModalBody from "../HomeStatsModalBody/HomeStatsModalBody";

const features = [
  {
    image: rightArrow,
    text: "<span><b>Prompt Quotes</b>: Get quick, competitive rates, tailored to your needs.</span>",
  },
  {
    image: uploadFile,
    text: "<span><b>Effortless Policy Management</b>: Access and manage your insurance policies anyday, anytime.</span>",
  },
  {
    image: stopWatch,
    text: "<span><b>Fast Claims Processing</b>: Experience seamless and speedy claims handlingfor complete peace of mind</span>",
  },
];

const statItems = [
  {
    stat: "8",
    icon: <HandShake />,
    title: "Strategic Partnerships",
    paragraph:
      "Our strategic partnerships with some of Nigeria’s leading insurance companies enable us to deliver a seamless experience from purchase to renewal and claims. We don’t work with just anyone; we collaborate with the right partners to ensure quality and reliability.",
    image:
      "https://res.cloudinary.com/dx3zrhslt/image/upload/v1749025377/Partnerships_hylgud.svg",
  },
  {
    stat: "21+",
    icon: <HandShake />,
    title: "Added Value Services",
    paragraph:
      "We maintain a network of value-adding partners, offering services such as vehicle tracker installation, fire extinguishers, first aid training, and more all aimed at further mitigating risk and enhancing overall protection.",
    image:
      "https://res.cloudinary.com/dx3zrhslt/image/upload/v1749025377/Added_Value_mdgj1x.svg",
  },
  {
    stat: "5",
    icon: <Automation />,
    title: "AI-Assisted Features ",
    paragraph:
      "Due diligence in the insurance industry requires speed, precision, and accurate data collection. To meet these demands, we have integrated AI and automation technologies into our processes accelerating and ultimately improving our service delivery.",
    image:
      "https://res.cloudinary.com/dx3zrhslt/image/upload/v1749025378/AI_k2rqcx.svg",
  },
];

const HomeStats = () => {
  // States
  const [modals, setModals] = useState<modalGenericType>({ details: false });
  const [selectedStat, setSelectedStat] = useState<null | number>(null);

  return (
    <>
      {modals.details && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <HomeStatsModalBody
              image={statItems[selectedStat as number]?.image}
              title={statItems[selectedStat as number]?.title}
              paragraph={statItems[selectedStat as number].paragraph}
            />
          }
        />
      )}

      <section className={classes.outerContainer}>
        <h2>Your Satisfaction Is Our Priority!</h2>

        <div className={classes.container}>
          <div>
            <Image
              src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1759153655/macbook_pro_efuysv.png"
              alt="Your Satisfaction Is Our Priority!"
              width={700}
              height={450}
            />
          </div>

          <div>
            <ul>
              {features?.map((data, i) => (
                <li key={i}>
                  <span>
                    <Image src={data?.image} alt="Feature Image" />
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: data?.text }}></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeStats;

// {statItems.map((data, i) => {
//   return (
//     <div
//       className={classes.info}
//       onClick={() => {
//         setSelectedStat(i);
//         setModalTrue(setModals, "details");
//       }}
//       key={data?.title}
//     >
//       <div>
//         <h4>{data?.stat}</h4>
//         <p>{data?.title} </p>
//       </div>
//       <div>{data?.icon}</div>
//     </div>
//   );
// })}
