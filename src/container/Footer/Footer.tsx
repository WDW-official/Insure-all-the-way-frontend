import Link from "next/link";
import classes from "./Footer.module.css";
import { routes } from "@/utilities/routes";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={classes.container}>
      <p>© 2025 Insure All The Way. - All Rights Reserved</p>
      <Link href={routes.PRIVACY_POLICY}>Privacy Policy</Link>
      <Link href={routes.TERMS_AND_CONDITIONS}>Terms and Conditions</Link>
      <div className={classes.logos}>
        <h4>Licensed and Certified By: </h4>
        <div>
          <a href="https://www.naicom.gov.ng/" target="_blank" rel="noreferrer">
            <Image
              src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1742904561/NAICOM_Logo_wq6cjs.svg"
              alt="National Insurance Commission Logo"
              height={90}
              width={90}
            />
          </a>

          <a href="https://ciinigeria.org/" target="_blank" rel="noreferrer">
            <Image
              src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1742904542/CIIN_Logo_esaymj.svg"
              alt="Chartered Insurance Institute of Nigeria Logo"
              height={70}
              width={70}
            />
          </a>

          <a
            href="https://nitda.gov.ng/wp-content/uploads/2021/01/NDPR-Implementation-Framework.pdf"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1742904542/NDPR_Logo_v2psuw.svg"
              alt=" Nigeria Data Protection Regulation Logo"
              height={90}
              width={90}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
