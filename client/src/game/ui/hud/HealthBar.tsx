import "./HealthBar.css";

const HealthBar: React.FC<{ value: number; max: number }> = ({
  max,
  value,
}) => {
  return <progress className="HealthBar" max={max} value={value}></progress>;
};

export default HealthBar;
