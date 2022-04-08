import React, { useEffect, useState } from "react";
import Game, { GameStates } from "engine/ecs/Game";
import Lobby from "./lobby/Lobby";
import PlayerModule from "game/modules/PlayerModule";
import WorldModule from "game/modules/WorldModule";
import Menu from "./menu/Menu";
import useInputs from "./hooks/useInputs";
import Hud from "./hud/Hud";

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
  playerHealth: number;
}
const createDefault = (): ContextProps => ({
  state: GameStates.LOBBY,
  setState: () => {},

  playerHealth: 100,
});
export const GameContext = React.createContext<ContextProps>(createDefault());
export const GameProvider: React.FC = () => {
  const [state, _setState] = useState<GameStates>(GameStates.LOBBY);
  const [playerHealth, _setPlayerHealth] = useState<number>(100);
  const { keys } = useInputs();

  useEffect(() => {
    game.State.subscribe((state) => _setState(state));
    game.EntityManager.GetEntity("Player")
      ?.GetObservable<number>("health")
      ?.subscribe((data) => _setPlayerHealth(data));
  }, []);

  const setState = (state: GameStates) => {
    game.State.broadcast(state);
  };

  useEffect(() => {
    if (state === GameStates.MATCH_PROGRESS) {
      document.body.requestPointerLock();
    } else {
      document.exitPointerLock();
    }
  }, [state]);

  useEffect(() => {
    console.log(keys);
    if (keys["Escape"]) {
      setState(GameStates.MENU);
    }
  }, [keys]);

  return (
    <GameContext.Provider value={{ state, setState, playerHealth }}>
      {state === GameStates.LOBBY && <Lobby />}
      {state === GameStates.MENU && <Menu />}
      {state === GameStates.MATCH_PROGRESS && <Hud />}
    </GameContext.Provider>
  );
};
export const useGame = () => React.useContext(GameContext);
