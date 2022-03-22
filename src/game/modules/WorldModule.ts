import Entity from "src/engine/ecs/Entity";
import EntityManager from "src/engine/ecs/EntityManager";
import Module from "src/engine/ecs/Module";
import ThreeController from "../components/ThreeController";

class WorldModule extends Module {
  constructor(private root: HTMLElement) {
    super();
  }

  Define(entityManager: EntityManager): void {
    const entity = new Entity("World");
    entity.AddComponent(new ThreeController(this.root));
    entityManager.AddEntity(entity);
  }
}

export default WorldModule;
