import Component from "src/engine/ecs/Component";
import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D } from "three";
import * as CANNON from "cannon-es";
import {
  threeQuatToCannonQuat,
  threeVec3ToCannonVec3,
} from "src/engine/physics/helper/translators";
class TestCube extends Component {
  public Body?: Object3D;
  constructor() {
    super();
  }

  public OnAdd(): void {
    const geometry = new BoxGeometry(30, 30, 30);
    const material = new MeshPhongMaterial({
      color: "#ff0000",
      depthWrite: false,
    });
    this.Body = new Mesh(geometry, material);
    this.Body.receiveShadow = true;
    this.Body.castShadow = true;
    this.Body.position.set(10, 10, 10);

    this.Body.userData.physicsBody = new CANNON.Body({
      mass: 1,
      position: threeVec3ToCannonVec3(this.Body.position),
      shape: new CANNON.Box(new CANNON.Vec3(15, 15, 15)),
      quaternion: threeQuatToCannonQuat(this.Body.quaternion),
      type: CANNON.Body.KINEMATIC,
    });
  }
}

export default TestCube;
