import Dropdown from "@/components/Dropdown/Dropdown";
import classes from "./IndividualAndFamilyHmoForm.module.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";

const IndividualAndFamilyHmoForm = () => {
  return (
    <section className={classes.container} id="recommendation-form">
      <div className={classes.header}>
        <h4>HMO Recommendation Form</h4>
        <p>Chart your path to better health with expert HMO recommendations.</p>
      </div>

      <form>
        <Dropdown
          label="Are you applying for yourself or for your family?"
          options={["Individual", "Family"]}
        />
        <Input
          label="What is your annual healthcare budget (in Naira)?"
          placeholder="Eg: 200,000"
          type="number"
        />

        <Dropdown
          label="Where do you need coverage?"
          options={["Nigeria", "India", "Africa"]}
          title="Select"
        />

        <Dropdown
          label="Do you require dental care coverage?"
          options={["Yes", "No"]}
          title="Select"
        />

        <Dropdown
          label="Do you require optical care coverage?"
          options={["Yes", "No"]}
          title="Select"
        />

        <Dropdown
          label="Do you require maternity or antenatal care?"
          options={["Yes", "No", "Maybe"]}
          title="Select"
        />

        <Dropdown
          label="Are you interested in telemedicine services?"
          options={["Yes", "No"]}
          title="Select"
        />

        <Dropdown
          label="Do you need coverage for specialised care?"
          options={[
            "Fertility",
            "ENT (Ear, Nose, Throat",
            "Surgical Services",
            "Family Planning",
            "None of the above",
          ]}
          title="Select"
        />

        <div>
          <Button>Recommend a Plan</Button>
        </div>
      </form>
    </section>
  );
};

export default IndividualAndFamilyHmoForm;
