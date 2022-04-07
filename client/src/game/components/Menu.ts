import Component from "engine/ecs/Component";
import Game, { GameStates } from "engine/ecs/Game";
import InputController from "./InputController";

class Menu extends Component {
  private _menu?: HTMLElement;
  private _root: HTMLElement | null;
  constructor() {
    super();
    this._root = document.getElementById("wrapper");
  }

  public OnAdd(): void {
    const gameState = this.Entity?.EntityManager?.Game?.State;

    if (gameState?.data === GameStates.MENU) {
      this._mountMenu();
    }

    gameState?.subscribe((data) => {
      if (data === GameStates.MENU) {
        this._mountMenu();
      } else {
        this._dismountMenu();
      }
    });
  }

  public OnUpdate(time: number): void {
    const inputs = this.Entity?.GetComponent<InputController>(
      InputController.name
    );

    if (!inputs) {
      return;
    }

    if (inputs.Keys.pause) {
      this.Entity?.EntityManager?.Game?.State.broadcast(GameStates.MENU);
    }
  }

  public OnDestroy(): void {
    document.exitPointerLock();
  }

  private _requestPointerLock = () => {
    document.body.requestPointerLock();
  };

  private _mountMenu() {
    this._menu = document.createElement("div");
    this._menu.className = "Menu__container";

    const closeButton = document.createElement("button");
    closeButton.innerText = "back";
    closeButton.addEventListener("click", () => {
      this._requestPointerLock();
      this.Entity?.EntityManager?.Game?.State.broadcast(
        GameStates.MATCH_PROGRESS
      );
    });

    const menuCard = document.createElement("div");
    menuCard.className = "Menu__card";

    menuCard.appendChild(closeButton);
    this._menu.appendChild(menuCard);

    this._root?.appendChild(this._menu);
  }

  private _dismountMenu() {
    if (!this._menu) {
      return;
    }

    console.log(this._root);
    this._root?.removeChild(this._menu);
  }
}

export default Menu;
