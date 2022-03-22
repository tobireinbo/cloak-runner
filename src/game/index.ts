import Game from "src/engine/ecs/Game";
import WorldModule from "./modules/WorldModule";

const gameElement = document.getElementById("game");
if (gameElement) {
  new Game().AddModule(new WorldModule(gameElement));
}
