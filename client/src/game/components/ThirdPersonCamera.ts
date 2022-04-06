import Component from "src/engine/ecs/Component";
import { Object3D, PerspectiveCamera, Vector3 } from "three";
import InputController from "./InputController";

class ThirdPersonCamera extends Component {
  private _currentPosition: Vector3;
  private _currentLookat: Vector3;
  private _camera: PerspectiveCamera;
  private _target: Object3D;

  constructor(params: { camera: PerspectiveCamera; target: Object3D }) {
    super();

    this._camera = params.camera;
    this._target = params.target;
    this._currentPosition = new Vector3();
    this._currentLookat = new Vector3();
  }

  private _caclulateIdealOffset() {
    const idealOffset = new Vector3(0, 20, -30);
    idealOffset.applyEuler(this._target.rotation);
    idealOffset.add(this._target.position);

    //terrain

    return idealOffset;
  }

  private _calculateIdealLookat() {
    const inputs = this.Entity?.GetComponent<InputController>(
      InputController.name
    );
    const idealLookat = new Vector3(
      0, //inputs?.CenterMousePosition.x,
      0, //inputs?.CenterMousePosition.y,
      20
    );
    idealLookat.applyEuler(this._target.rotation);
    idealLookat.add(this._target.position);
    return idealLookat;
  }

  public OnUpdate(time: number): void {
    const idealOffset = this._caclulateIdealOffset();
    const idealLookat = this._calculateIdealLookat();

    const t = 1.0 - Math.pow(0.01, time);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookat.lerp(idealLookat, t);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);
  }
}

export default ThirdPersonCamera;
