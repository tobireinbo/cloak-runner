import Entity from "engine/ecs/Entity";
import EntityManager from "engine/ecs/EntityManager";
import Module from "engine/ecs/Module";
import Observable from "lib/Observable";
import FirstPersonPlayer from "game/components/FirstPersonPlayer";
import InputController from "game/components/InputController";
import ThreeController from "game/components/ThreeController";
import * as CANNON from "cannon-es";

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

      if (threeController) {
        if (threeController.Camera) {
          const FPSPlayer = new FirstPersonPlayer({
            camera: threeController.Camera,
            body: new CANNON.Body({
              mass: 10,
              shape: new CANNON.Sphere(1.3),
              position: new CANNON.Vec3(0, 3, -10),
              linearDamping: 0.9,
            }),
          });
          entity.AddComponent(FPSPlayer);
          threeController.AddBody(FPSPlayer.Object);
        }
      }
    }
  }
}

export default PlayerModule;
