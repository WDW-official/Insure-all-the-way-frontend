import Image from "next/image";
import classes from "./ContactUsImages.module.css";

const ContactUsImages = () => {
  return (
    <section className={classes.container}>
      <Image
        src="https://res.cloudinary.com/dfilepe0f/image/upload/v1742005288/Contact_Us_jkwrx3.svg"
        width={800}
        height={800}
        alt="Contact Us"
      />
    </section>
  );
};

export default ContactUsImages;
