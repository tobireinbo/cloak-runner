import Entity from "engine/ecs/Entity";
import EntityManager from "engine/ecs/EntityManager";
import Module from "engine/ecs/Module";
import range from "lib/range";
import { Vector3 } from "three";
import Ground from "../components/Ground";
import TestCube from "../components/TestCube";
import ThreeController from "../components/ThreeController";

class WorldModule extends Module {
  constructor(private _root: HTMLElement) {
    super();
  }

  Define(entityManager: EntityManager): void {
    const entity = new Entity("World");
    entityManager.AddEntity(entity);
    const threeController = new ThreeController(this._root);
    entity.AddComponent(threeController);

    const ground = new Ground(1000);
    entity.AddComponent(ground);

    threeController.AddBody(ground.Body);
    for (const i of range(0, 50)) {
      const cube = new TestCube({
        size: 20,
        position: new Vector3(
          Math.random() > 0.5 ? Math.random() * 100 : Math.random() * -100,
          10,
          i * 100
        ),
      });
      entity.AddComponent(cube);
      threeController.AddBody(cube.Body);
    }
  }
}

export default WorldModule;
