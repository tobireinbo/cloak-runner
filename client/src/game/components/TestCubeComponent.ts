import Component from "src/engine/ecs/Component";
import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D } from "three";
import { PlayerProps } from "../modules/PlayerModule";

class TestCubeComponent extends Component {
  public Cube?: Object3D;
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
  }
}

export default TestCubeComponent;
