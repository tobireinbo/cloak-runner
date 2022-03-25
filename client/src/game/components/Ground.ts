import Component from "src/engine/ecs/Component";
import RigidBody from "src/engine/physics/RigidBody";
import { AmmoLib } from "src/main";
import { BoxGeometry, Mesh, MeshPhongMaterial, Vector3 } from "three";

class Ground extends Component {
  public Body?: Mesh;
  public Rigid?: any;

  constructor(private size: number) {
    super();
  }

  public OnAdd(): void {
    const ground = new Mesh(
      new BoxGeometry(this.size, 1, this.size),
      new MeshPhongMaterial({ color: "#102300", depthWrite: false })
    );
    ground.receiveShadow = true;
    this.Body = ground;

    const rigidBody = new RigidBody(AmmoLib);
    rigidBody.CreateBox({
      mass: 0, //makes it float,
      pos: ground.position,
      quat: ground.quaternion,
      size: new Vector3(this.size, 1, this.size),
    });
    this.Rigid = rigidBody;
  }
}

export default Ground;
