type CloseTypes = {
  onClick?: () => void;
  fill?: string;
  dimensions?: { width: string; height: string };
  noBg?: boolean;
};

const Close = ({ onClick, fill, dimensions, noBg }: CloseTypes) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={dimensions?.height || "32px"}
      viewBox="0 -960 960 960"
      width={dimensions?.width || "32px"}
      fill={fill || "#fff"}
      onClick={onClick}
      style={
        !noBg
          ? {
              cursor: "pointer",
              border: "2px solid red",
              background: "red",
              borderRadius: "5px",
              padding: "0.25rem",
            }
          : {}
      }
    >
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
    </svg>
  );
};

export default Close;
