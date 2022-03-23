import Entity from "src/engine/ecs/Entity";
import EntityManager from "src/engine/ecs/EntityManager";
import Module from "src/engine/ecs/Module";
import Observable from "src/lib/Observable";
import { Quaternion, Vector3 } from "three";

class PlayerModule extends Module {
  constructor() {
    super();
  }

  Define(entityManager: EntityManager): void {
    const entity = new Entity("Player");

    entity.AddObservable("position", new Observable(new Vector3()));
    entity.AddObservable("rotation", new Observable(new Quaternion()));

    entityManager.AddEntity(entity);
  }
}

export default PlayerModule;
