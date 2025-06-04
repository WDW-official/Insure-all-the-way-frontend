import Image from "next/image";
import classes from "./HomeStatsModalBody.module.css";

type HomeStatsModalBodyTypes = {
  title: string;
  image: string;
  paragraph: string;
};

const HomeStatsModalBody = ({
  title,
  image,
  paragraph,
}: HomeStatsModalBodyTypes) => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h4>{title}</h4>
        <Image src={image} alt={title} width={40} height={40} />
      </div>
      <p>{paragraph}</p>
    </div>
  );
};

export default HomeStatsModalBody;
