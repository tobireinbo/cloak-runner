import "src/style.css";
import Game from "src/engine/ecs/Game";
import WorldModule from "src/game/modules/WorldModule";
import PlayerModule from "./game/modules/PlayerModule";

const gameElement = document.getElementById("game");

if (gameElement) {
  new Game()
    .AddModule(new WorldModule(gameElement))
    .AddModule(new PlayerModule());
} else {
  console.log("couldnt get element");
}
