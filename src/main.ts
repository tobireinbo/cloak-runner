import Game from "src/engine/ecs/Game";
import WorldModule from "src/game/modules/WorldModule";
import "src/style.css";

const gameElement = document.getElementById("game");
if (gameElement) {
  new Game().AddModule(new WorldModule(gameElement));
} else {
  console.log("couldnt get element");
}
