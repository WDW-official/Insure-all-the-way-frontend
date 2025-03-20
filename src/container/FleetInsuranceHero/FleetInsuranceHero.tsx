import Button from "@/components/Button/Button";
import classes from "../ComprehensiveMotorInsuranceHero/ComprehensiveMotorInsuranceHero.module.css";
import CheckCircle from "@/assets/svgIcons/CheckCircle";
import { useRouter } from "next/navigation";
import Image from "next/image";

const features = [
  "Policy Management: Seamless implementation and renewal of fleet insurance, ensuring uninterrupted coverage.",
  "Safety Training: Expert-led driver education to minimize accidents, reduce costs, and enhance road safety.",
  "Compliance Support: Stay ahead of regulations with dedicated assistance in meeting industry standards.",
  "Risk Management Services: Advanced monitoring and reporting to prevent accidents and lower",
];

const FleetInsuranceHero = () => {
  // Router
  const router = useRouter();

  return (
    <section className={classes.outerContainer}>
      <div className={classes.container}>
        <h1>
          Our fleet insurance policies provide <span>your organisation </span>{" "}
          with the following:
        </h1>

        {features.map((data, i) => {
          return (
            <p key={i}>
              <CheckCircle />
              <span>{data}</span>
            </p>
          );
        })}

        <Button
          onClick={() => {
            router.push("#insurance-form");
          }}
        >
          Learn more
        </Button>
      </div>
      <div>
        <Image
          src="https://res.cloudinary.com/dfilepe0f/image/upload/v1742314773/Fleet_Motor_Insurance_2_aedygk.svg"
          fill
          alt="Motor Insurance"
        />
      </div>
    </section>
  );
};

export default FleetInsuranceHero;
