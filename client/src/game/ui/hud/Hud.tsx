import { useGame } from "../GameContext";
import HealthBar from "./HealthBar";
import "./Hud.css";

const Hud: React.FC = () => {
  const { playerHealth } = useGame();

  return (
    <div className="Hud">
      <div className="Hud__stats">
        <HealthBar max={100} value={playerHealth} />
      </div>
    </div>
  );
};

export default Hud;
