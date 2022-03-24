import Game from "src/engine/ecs/Game";
import WorldModule from "src/game/modules/WorldModule";
import "src/style.css";
import PlayerModule from "./game/modules/PlayerModule";

const gameElement = document.getElementById("game");
if (gameElement) {
  const game = new Game()
    .AddModule(new WorldModule(gameElement))
    .AddModule(new PlayerModule());
} else {
  console.log("couldnt get element");
}
