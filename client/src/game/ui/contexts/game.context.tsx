import React, { useEffect, useState } from "react";
import Game, { GameStates } from "engine/ecs/Game";
import Lobby from "../lobby/Lobby";
import PlayerModule from "game/modules/PlayerModule";
import WorldModule from "game/modules/WorldModule";

//
//  Setup Game
//
const gameElement = document.getElementById("game");
const game = new Game();

if (gameElement) {
  game.AddModule(new WorldModule(gameElement)).AddModule(new PlayerModule());
} else {
  console.log("couldnt get element");
}
//
//
//

interface ContextProps {
  state: GameStates;
  setState: (state: GameStates) => void;
}
const createDefault = (): ContextProps => ({
  state: GameStates.LOBBY,
  setState: () => {},
});
export const GameContext = React.createContext<ContextProps>(createDefault());
export const GameProvider: React.FC = () => {
  const [state, _setState] = useState<GameStates>(GameStates.LOBBY);

  useEffect(() => {
    game.State.subscribe((state) => _setState(state));
  }, []);

  const setState = (state: GameStates) => {
    game.State.broadcast(state);
  };

  return (
    <GameContext.Provider value={{ state, setState }}>
      {state === GameStates.LOBBY && <Lobby />}
    </GameContext.Provider>
  );
};
export const useGame = () => React.useContext(GameContext);
