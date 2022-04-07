import "src/style.css";
import Game from "src/engine/ecs/Game";
import WorldModule from "src/game/modules/WorldModule";
import PlayerModule from "./game/modules/PlayerModule";
import MenuModule from "./game/modules/MenuModule";

const gameElement = document.getElementById("game");

if (gameElement) {
  new Game()
    .AddModule(new MenuModule())
    .AddModule(new WorldModule(gameElement))
    .AddModule(new PlayerModule());
} else {
  console.log("couldnt get element");
}
