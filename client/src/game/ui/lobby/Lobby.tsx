import Game, { GameStates } from "engine/ecs/Game";
import { useGame } from "../GameContext";
import HealthBar from "../hud/HealthBar";
import Button from "../shared/Button";
import "./Lobby.css";

const Lobby: React.FC = () => {
  const { state, setState } = useGame();

  return (
    <div className="Lobby__wrapper">
      <div className="Lobby__card">
        <h1>CLOAK RUNNER</h1>
        <Button
          onClick={() => {
            setState(GameStates.MATCH_PROGRESS);
          }}
        >
          host a game
        </Button>
        <Button>join a game</Button>
        <Button>settings</Button>
      </div>
    </div>
  );
};

export default Lobby;
