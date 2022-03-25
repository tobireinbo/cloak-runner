import Component from "src/engine/ecs/Component";
import { PerspectiveCamera, Vector3 } from "three";
import { PlayerProps } from "../modules/PlayerModule";

class BirdCameraComponent extends Component {
  private _lookat?: Vector3;

  constructor(private _params: { camera: PerspectiveCamera }) {
    super();
  }

  public OnAdd(): void {
    this._lookat = new Vector3();
  }

  public OnUpdate(time: number, delta: number): void {
    const position = this.Entity?.GetObservable<Vector3>(
      PlayerProps.POSITION
    )?.data;
    const lookat = position;
    const offset = new Vector3(-60, 70, 0);

    if (lookat && this._lookat) {
      this._lookat.copy(lookat);
      this._params.camera.lookAt(this._lookat);
      this._params.camera.position.set(
        lookat.x + offset.x,
        lookat.y + offset.y,
        lookat.z + offset.z
      );
    }
  }
}

export default BirdCameraComponent;
