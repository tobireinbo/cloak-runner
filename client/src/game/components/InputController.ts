import Component from "src/engine/ecs/Component";

class InputController extends Component {
  public readonly Keys: {
    forward: 0 | 1;
    back: 0 | 1;
    left: 0 | 1;
    right: 0 | 1;
  };

  constructor() {
    super();
    this.Keys = { forward: 0, back: 0, left: 0, right: 0 };
  }

  public OnAdd(): void {
    window.addEventListener("keydown", this._handleKeyDown, false);
    window.addEventListener("keyup", this._handleKeyUp, false);
  }

  public OnDestroy(): void {
    window.removeEventListener("keydown", this._handleKeyDown, false);
    window.removeEventListener("keyup", this._handleKeyUp, false);
  }

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
