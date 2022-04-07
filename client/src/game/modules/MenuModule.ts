import Entity from "engine/ecs/Entity";
import EntityManager from "engine/ecs/EntityManager";
import Module from "engine/ecs/Module";
import InputController from "../components/InputController";
import Menu from "../components/Menu";

class MenuModule extends Module {
  constructor() {
    super();
  }

  public Define(entityManager: EntityManager): void {
    const entity = new Entity("Menu");
    entityManager.AddEntity(entity);
    entity.AddComponent(new Menu());
    entity.AddComponent(new InputController());
  }
}

export default MenuModule;
