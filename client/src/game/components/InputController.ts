import Component from "src/engine/ecs/Component";
import { Vector2 } from "three";

class InputController extends Component {
  public readonly Keys: {
    forward: 0 | 1;
    back: 0 | 1;
    left: 0 | 1;
    right: 0 | 1;
  };

  public readonly MousePosition: Vector2;

  public readonly CenterMousePosition: Vector2;

  //0 -> screen center
  //-1 -> completely to left
  //1 -> completely to right
  public readonly NormalizedCenteredMousePosition: Vector2;

  constructor() {
    super();
    this.Keys = { forward: 0, back: 0, left: 0, right: 0 };
    this.MousePosition = new Vector2(0, 0);
    this.CenterMousePosition = new Vector2(0, 0);
    this.NormalizedCenteredMousePosition = new Vector2(0, 0);
  }

  public OnAdd(): void {
    window.addEventListener("keydown", this._handleKeyDown, false);
    window.addEventListener("keyup", this._handleKeyUp, false);
    window.addEventListener("mousemove", this._handleMouseMove, false);
  }

  public OnDestroy(): void {
    window.removeEventListener("keydown", this._handleKeyDown, false);
    window.removeEventListener("keyup", this._handleKeyUp, false);
    window.removeEventListener("mousemove", this._handleMouseMove, false);
  }

  private _handleMouseMove = (event: MouseEvent) => {
    this.MousePosition.set(event.x, event.y);

    const centeredX = window.innerWidth / 2 - event.x;
    const centeredY = window.innerHeight / 2 - event.y;

    this.CenterMousePosition.set(centeredX, centeredY);
  };

  private _handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "w":
        this.Keys.forward = 1;
        break;
      case "a":
        this.Keys.left = 1;
        break;
      case "s":
        this.Keys.back = 1;
        break;
      case "d":
        this.Keys.right = 1;
        break;
    }
  };

  private _handleKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case "w":
        this.Keys.forward = 0;
        break;
      case "a":
        this.Keys.left = 0;
        break;
      case "s":
        this.Keys.back = 0;
        break;
      case "d":
        this.Keys.right = 0;
        break;
    }
  };
}

export default InputController;
