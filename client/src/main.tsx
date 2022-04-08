import "./style.css";
import React from "react";
import ReactDOM from "react-dom";
import { GameProvider } from "game/ui/GameContext";

ReactDOM.render(
  <React.StrictMode>
    <GameProvider />
  </React.StrictMode>,
  document.getElementById("wrapper")
);
