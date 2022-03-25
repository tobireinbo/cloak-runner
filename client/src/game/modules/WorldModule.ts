import Entity from "src/engine/ecs/Entity";
import EntityManager from "src/engine/ecs/EntityManager";
import Module from "src/engine/ecs/Module";
import ThreeController from "../components/ThreeController";

class WorldModule extends Module {
  constructor(private _root: HTMLElement) {
    super();
  }

  Define(entityManager: EntityManager): void {
    const entity = new Entity("World");
    entityManager.AddEntity(entity);
    entity.AddComponent(new ThreeController(this._root));
  }
}

export default WorldModule;
