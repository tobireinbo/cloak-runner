import Component from "engine/ecs/Component";
import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D, Vector3 } from "three";
import * as CANNON from "cannon-es";
import {
  threeQuatToCannonQuat,
  threeVec3ToCannonVec3,
} from "engine/physics/helper/translators";
class TestCube extends Component {
  public Body?: Object3D;
  constructor(
    private _params: {
      position: Vector3;
      size: number;
    }
  ) {
    super();
  }

  public OnAdd(): void {
    const geometry = new BoxGeometry(
      this._params.size,
      this._params.size,
      this._params.size
    );
    const material = new MeshPhongMaterial({
      color: "#ff0000",
    });
    this.Body = new Mesh(geometry, material);
    this.Body.receiveShadow = true;
    this.Body.castShadow = true;
    this.Body.position.copy(this._params.position);

    this.Body.userData.physicsBody = new CANNON.Body({
      mass: 1,
      position: threeVec3ToCannonVec3(this.Body.position),
      shape: new CANNON.Box(
        new CANNON.Vec3(
          this._params.size / 2,
          this._params.size / 2,
          this._params.size / 2
        )
      ),
      quaternion: threeQuatToCannonQuat(this.Body.quaternion),
      type: CANNON.Body.KINEMATIC,
    });
  }
}

export default TestCube;
