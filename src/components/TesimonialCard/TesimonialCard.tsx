import classes from "./TesimonialCard.module.css";

type TesimonialCardTypes = {
  name: string;
  role: string;
  comment: string;
};

const TesimonialCard = ({ name, role, comment }: TesimonialCardTypes) => {
  return (
    <div className={classes.container}>
      <h4>{name}</h4>
      <p>{role}</p>
      <p>{comment}</p>
    </div>
  );
};

export default TesimonialCard;
