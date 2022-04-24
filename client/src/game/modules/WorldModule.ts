import Entity from "engine/ecs/Entity";
import EntityManager from "engine/ecs/EntityManager";
import Module from "engine/ecs/Module";
import ThreeController from "../components/ThreeController";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class WorldModule extends Module {
  constructor(private _root: HTMLElement) {
    super();
  }

  Define(entityManager: EntityManager): void {
    const entity = new Entity("World");
    entityManager.AddEntity(entity);
    const threeController = new ThreeController(this._root);
    entity.AddComponent(threeController);

    const loader = new GLTFLoader().setPath("assets/blender_test/");
    loader.load("scene.glb", (gltf) => {
      console.log(gltf);
      threeController.Scene?.add(gltf.scene);
      console.log(threeController.Scene);
      threeController.Octree.fromGraphNode(gltf.scene);
      gltf.scene.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
    });
  }
}

export default WorldModule;
