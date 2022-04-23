import Component from "engine/ecs/Component";
import { Vector2 } from "three";

class InputController extends Component {
  public readonly Keys: {
    forward: 0 | 1;
    back: 0 | 1;
    left: 0 | 1;
    right: 0 | 1;
    jump: 0 | 1;
    pause: 0 | 1;
    mouseL: 0 | 1;
    mouseR: 0 | 1;
    shift: 0 | 1;
  };

  public readonly MouseMovement: Vector2;

  constructor() {
    super();
    this.Keys = {
      forward: 0,
      back: 0,
      left: 0,
      right: 0,
      jump: 0,
      pause: 0,
      mouseL: 0,
      mouseR: 0,
      shift: 0,
    };

    this.MouseMovement = new Vector2(0, 0);
  }

  public OnAdd(): void {
    window.addEventListener("keydown", this._handleKeyDown, false);
    window.addEventListener("keyup", this._handleKeyUp, false);
    window.addEventListener("mousemove", this._handleMouseMove, false);
    window.addEventListener("mousedown", this._handleMouseDown, false);
    window.addEventListener("mouseup", this._handleMouseUp, false);
  }

  public OnDestroy(): void {
    window.removeEventListener("keydown", this._handleKeyDown, false);
    window.removeEventListener("keyup", this._handleKeyUp, false);
    window.removeEventListener("mousemove", this._handleMouseMove, false);
    window.removeEventListener("mousedown", this._handleMouseDown, false);
    window.removeEventListener("mouseup", this._handleMouseUp, false);
  }

  private _handleMouseMove = (event: MouseEvent) => {
    this.MouseMovement.set(event.movementX, event.movementY);
  };

  private _handleMouseDown = (event: MouseEvent) => {
    switch (event.button) {
      case 0:
        this.Keys.mouseL = 1;
        break;
      case 2:
        this.Keys.mouseR = 1;
        break;
    }
  };

  private _handleMouseUp = (event: MouseEvent) => {
    switch (event.button) {
      case 0:
        this.Keys.mouseL = 0;
        break;
      case 2:
        this.Keys.mouseR = 0;
        break;
    }
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
      case " ":
        this.Keys.jump = 1;
        break;
      case "Escape":
        this.Keys.pause = 1;
        break;
      case "Shift":
        this.Keys.shift = 1;
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
      case " ":
        this.Keys.jump = 0;
        break;
      case "Escape":
        this.Keys.pause = 0;
        break;
      case "Shift":
        this.Keys.shift = 0;
        break;
    }
  };
}

export default InputController;
