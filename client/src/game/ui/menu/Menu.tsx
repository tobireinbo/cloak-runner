import { GameStates } from "engine/ecs/Game";
import { useGame } from "../GameContext";
import Button from "../shared/Button";
import "./Menu.css";

const Menu: React.FC = () => {
  const { setState } = useGame();

  return (
    <div className="Menu__wrapper">
      <div className="Menu__card">
        <Button onClick={() => setState(GameStates.MATCH_PROGRESS)}>
          continue
        </Button>
        <Button onClick={() => setState(GameStates.LOBBY)}>back to menu</Button>
      </div>
    </div>
  );
};

export default Menu;
