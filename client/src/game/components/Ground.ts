import Component from "src/engine/ecs/Component";
import { BoxGeometry, Mesh, MeshPhongMaterial } from "three";
import * as CANNON from "cannon-es";
class Ground extends Component {
  public Body?: Mesh;

  constructor(private size: number) {
    super();
  }

  public OnAdd(): void {
    const ground = new Mesh(
      new BoxGeometry(this.size, 1, this.size),
      new MeshPhongMaterial({ color: "#102300", depthWrite: false })
    );
    ground.receiveShadow = true;

    const physicsGround = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(this.size / 2, 1, this.size / 2)),
    });

    ground.userData.physicsBody = physicsGround;
    this.Body = ground;
  }
}

export default Ground;
