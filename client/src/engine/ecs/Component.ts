import Entity from "./Entity";

class Component {
  private _entity?: Entity;

  constructor() {}

  public get Entity() {
    return this._entity;
  }

  public get Game() {
    return this._entity?.EntityManager?.Game;
  }

  public SetEntity(entity: Entity) {
    this._entity = entity;
  }

  //define these lifecycle methods when extending this class
  public OnUpdate(time: number) {}
  public OnAdd() {}
  public OnDestroy() {}
}

export default Component;
