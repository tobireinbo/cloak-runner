import Component from "engine/ecs/Component";
import { PerspectiveCamera, Vector3 } from "three";
import TestCube from "./TestCube";

class BirdCamera extends Component {
  private _lookat?: Vector3;

  constructor(private _params: { camera: PerspectiveCamera }) {
    super();
  }

  public OnAdd(): void {
    this._lookat = new Vector3();
  }

  public OnUpdate(time: number): void {
    const position = this.Entity?.GetComponent<TestCube>(TestCube.name)?.Body
      ?.position;
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

export default BirdCamera;
