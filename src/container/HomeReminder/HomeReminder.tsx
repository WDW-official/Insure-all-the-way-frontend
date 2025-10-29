import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import { modalGenericType } from "@/utilities/types";
import Image from "next/image";
import { useState } from "react";
import CreateLeadForm from "../CreateLeadForm/CreateLeadForm";
import classes from "./HomeReminder.module.css";

const HomeReminder = () => {
  // States
  const [modals, setModals] = useState<modalGenericType>({ reminder: false });

  return (
    <>
      {modals.reminder && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={<CreateLeadForm onClose={() => setAllModalsFalse(setModals)} />}
        />
      )}

      <section className={classes.container} id="reminder">
        <div>
          <Image
            src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1761729309/phone-1468467_1920_ofk0qi.png"
            alt="Get Renewal Reminders"
            width={700}
            height={700}
          />
        </div>
        <div>
          <h4>Get Renewal Reminders</h4>
          <p>
            Stay ahead of your renewal dates with our free Reminder Service.
            Simply enter your vehicle and contact details, and we’ll send you
            timely notifications before your insurance, vehicle licence, or
            roadworthiness certificate expires. Whether you’re a regular
            customer or just exploring your options, this service ensures you
            never have to worry about missing a deadline or facing unnecessary
            penalties.
          </p>
          <p>
            With Insure All The Way, staying compliant and protected is
            effortless. Our system automatically reminds you weeks before each
            due date, giving you plenty of time to renew or explore better
            policy options. Let us handle the reminders while you focus on the
            road, peace of mind has never been this simple.
          </p>
          <Button
            type="secondary"
            onClick={() => setModalTrue(setModals, "reminder")}
          >
            Set Reminders
          </Button>
        </div>
      </section>
    </>
  );
};

export default HomeReminder;
