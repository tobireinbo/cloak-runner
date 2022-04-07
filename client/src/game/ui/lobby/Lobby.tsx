import Game, { GameStates } from "engine/ecs/Game";
import { useGame } from "../contexts/game.context";

const Lobby: React.FC = () => {
  const { state, setState } = useGame();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        zIndex: 1,
      }}
    >
      <h1>Lobby</h1>
      <button
        onClick={() => {
          setState(GameStates.MATCH_PROGRESS);
        }}
      >
        start
      </button>
    </div>
  );
};

export default Lobby;
