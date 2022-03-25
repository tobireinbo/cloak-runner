import Entity from "src/engine/ecs/Entity";
import EntityManager from "src/engine/ecs/EntityManager";
import Module from "src/engine/ecs/Module";
import Observable from "src/lib/Observable";
import { Quaternion, Vector3 } from "three";
import BirdCamera from "../components/BirdCamera";
import TestCube from "../components/TestCube";
import ThreeController from "../components/ThreeController";

export enum PlayerProps {
  POSITION = "position",
  ROTATION = "rotation",
}
class PlayerModule extends Module {
  constructor() {
    super();
  }

  Define(entityManager: EntityManager): void {
    const entity = new Entity("Player");
    entityManager.AddEntity(entity);

    entity.AddObservable(PlayerProps.POSITION, new Observable(new Vector3()));
    entity.AddObservable(
      PlayerProps.ROTATION,
      new Observable(new Quaternion())
    );

    const testCube = new TestCube();
    entity.AddComponent(testCube);

    const worldEntity = entityManager.GetEntity("World");
    if (worldEntity && testCube.Cube) {
      const threeController = worldEntity.GetComponent<ThreeController>(
        ThreeController.name
      );

      if (threeController) {
        threeController.AddRigidBody(testCube.RigidBody, testCube.Cube);
        if (threeController.Camera) {
          entity.AddComponent(
            new BirdCamera({ camera: threeController.Camera })
          );
        }
      }
    }
  }
}

export default PlayerModule;
