import Entity from "src/engine/ecs/Entity";
import EntityManager from "src/engine/ecs/EntityManager";
import Module from "src/engine/ecs/Module";
import Observable from "src/lib/Observable";
import { Quaternion, Vector3 } from "three";
import FirstPersonPlayer from "../components/FirstPersonPlayer";
import InputController from "../components/InputController";
import ThreeController from "../components/ThreeController";
import * as CANNON from "cannon-es";

export enum PlayerProps {
  POSITION = "position",
  ROTATION = "rotation",
}
class PlayerModule extends Module {
  Define(entityManager: EntityManager): void {
    const entity = new Entity("Player");
    entityManager.AddEntity(entity);

    entity.AddObservable(PlayerProps.POSITION, new Observable(new Vector3()));
    entity.AddObservable(
      PlayerProps.ROTATION,
      new Observable(new Quaternion())
    );

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
              position: new CANNON.Vec3(0, 3, 0),
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
