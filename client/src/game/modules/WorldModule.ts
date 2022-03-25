import Entity from "src/engine/ecs/Entity";
import EntityManager from "src/engine/ecs/EntityManager";
import Module from "src/engine/ecs/Module";
import Ground from "../components/Ground";
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

    const ground = new Ground(200);
    entity.AddComponent(ground);
    threeController.AddBody(ground.Body);
  }
}

export default WorldModule;
