import HandShake from "@/assets/svgIcons/HandShake";
import classes from "./HomeStats.module.css";
import CheckCircle from "@/assets/svgIcons/CheckCircle";
import Reward from "@/assets/svgIcons/Reward";
import rightArrow from "../../assets/images/right-arrow.svg";
import stopWatch from "../../assets/images/stopwatch.svg";
import uploadFile from "../../assets/images/upload-file.svg";
import Image from "next/image";

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

const HomeStats = () => {
  return (
    <section className={classes.container}>
      <div>
        <div>
          <div className={classes.info}>
            <div>
              <h4>8</h4>
              <p>Strategic Partners</p>
            </div>
            <div>
              <HandShake />
            </div>
          </div>

          <div className={classes.info}>
            <div>
              <h4>21+</h4>
              <p>Added Value Services </p>
            </div>
            <div>
              <Reward />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>Your Satisfaction Is Our Priority!</h2>

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
    </section>
  );
};

export default HomeStats;
