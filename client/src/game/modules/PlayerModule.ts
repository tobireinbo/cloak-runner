import Entity from "engine/ecs/Entity";
import EntityManager from "engine/ecs/EntityManager";
import Module from "engine/ecs/Module";
import Observable from "lib/Observable";
import InputController from "game/components/InputController";
import ThreeController from "game/components/ThreeController";
import BasicCharacter from "game/components/BasicCharacter";

export enum PlayerProps {
  POSITION = "position",
  ROTATION = "rotation",
}
class PlayerModule extends Module {
  Define(entityManager: EntityManager): void {
    const entity = new Entity("Player");
    entityManager.AddEntity(entity);

    entity.AddObservable("health", new Observable(50));

    const inputs = new InputController();
    entity.AddComponent(inputs);

    const worldEntity = entityManager.GetEntity("World");
    if (worldEntity) {
      const threeController = worldEntity.GetComponent<ThreeController>(
        ThreeController.name
      );

      if (threeController && threeController.Camera) {
        const char = new BasicCharacter({
          octree: threeController.Octree,
          inputs,
          camera: threeController.Camera,
        });
        entity.AddComponent(char);
      }
    }
  }
}

export default PlayerModule;
