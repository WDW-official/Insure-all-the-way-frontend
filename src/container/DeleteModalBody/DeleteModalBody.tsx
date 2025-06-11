import Button from "@/components/Button/Button";
import classes from "./DeleteModalBody.module.css";

type DeleteModalBodyTypes = {
  onClose: () => void;
  onDelete: () => void;
  header: string;
  caption: string;
};

const DeleteModalBody = ({
  onClose,
  onDelete,
  header,
  caption,
}: DeleteModalBodyTypes) => {
  return (
    <div className={classes.container}>
      <h3>{header}</h3>
      <p>{caption}</p>

      <div className={classes.buttonSection}>
        <Button type="invalid" onClick={onClose}>
          Cancel
        </Button>
        <Button type="delete" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteModalBody;
