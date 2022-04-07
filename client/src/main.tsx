import "./style.css";
import Game from "engine/ecs/Game";
import WorldModule from "game/modules/WorldModule";
import PlayerModule from "./game/modules/PlayerModule";
import React from "react";
import ReactDOM from "react-dom";
import { GameProvider } from "game/ui/contexts/game.context";

ReactDOM.render(
  <React.StrictMode>
    <GameProvider />
  </React.StrictMode>,
  document.getElementById("wrapper")
);
