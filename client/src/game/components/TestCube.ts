import Component from "src/engine/ecs/Component";
import RigidBody from "src/engine/physics/RigidBody";
import { AmmoLib } from "src/main";
import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D, Vector3 } from "three";

class TestCube extends Component {
  public Cube?: Object3D;
  public RigidBody: any;
  constructor() {
    super();
  }

  public OnAdd(): void {
    const geometry = new BoxGeometry(30, 30, 30);
    const material = new MeshPhongMaterial({
      color: "#ff0000",
      depthWrite: false,
    });
    this.Cube = new Mesh(geometry, material);
    this.Cube.receiveShadow = true;
    this.Cube.castShadow = true;
    this.Cube.position.setY(50);

    const rb = new RigidBody(AmmoLib);
    rb.CreateBox({
      mass: 1,
      pos: this.Cube.position,
      quat: this.Cube.quaternion,
      size: new Vector3(30, 30, 30),
    });
    rb.Body.setFriction(4);
    rb.Body.setRollingFriction(10);

    this.RigidBody = rb;
  }
}

export default TestCube;
