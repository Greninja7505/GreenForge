import ClickSpark from "../effects/ClickSpark";

const SparkButton = ({ children, sparkColor = "#8b5cf6", ...props }) => {
  return (
    <ClickSpark
      sparkColor={sparkColor}
      sparkSize={8}
      sparkRadius={15}
      sparkCount={6}
      duration={400}
    >
      {children}
    </ClickSpark>
  );
};

export default SparkButton;
