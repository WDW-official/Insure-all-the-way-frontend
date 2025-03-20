import HandShake from "@/assets/svgIcons/HandShake";
import classes from "./HomeStats.module.css";
import CheckCircle from "@/assets/svgIcons/CheckCircle";
import Reward from "@/assets/svgIcons/Reward";

const features = [
  "<span><b>Instant Insurance Quotes</b>: Get quick, competitive rates, tailored to your needs.</span>",
  "<span><b>Effortless policy management</b>: Access and manage your insurance policies anyday, anytime.</span>",
  "<span><b>Fast Claims Processing</b>: Experience seamless and speedy claims handlingfor complete peace of mind</span>",
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
        <h2>
          Your Satisfaction <br /> Is Our Priority!
        </h2>

        <ul>
          {features?.map((data, i) => (
            <li key={i}>
              <span>
                <CheckCircle />
              </span>
              <span dangerouslySetInnerHTML={{ __html: data }}></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeStats;
