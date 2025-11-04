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
            src="https://res.cloudinary.com/dx3zrhslt/image/upload/v1762161839/Get_Renewal_Reminders_t7vp0i.svg"
            alt="Get Renewal Reminders"
            width={700}
            height={700}
          />
        </div>
        <div>
          <h4>Never miss your vehicle insurance renewal</h4>
          <p>
            Never miss your vehicle insurance renewal again. With our free
            Renewal Reminder Service, you’ll receive timely alerts before your
            insurance, vehicle licence, or roadworthiness certificate expires.
          </p>
          <p>
            Simply enter your vehicle and contact details and{" "}
            <strong>Insure All The Way</strong> will keep you covered and
            compliant.
          </p>
          <p>
            <strong>{"Insurance Made Easy".toUpperCase()} </strong>
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
