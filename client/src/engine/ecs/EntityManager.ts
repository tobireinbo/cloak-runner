import Entity from "./Entity";

class EntityManager {
  private _entities: Map<string, Entity>;

  constructor() {
    this._entities = new Map();
  }

  public AddEntity(entity: Entity) {
    this._entities.set(entity.Name, entity);
  }

  public GetEntity(name: string) {
    return this._entities.get(name);
  }

  public Update(time: number, delta: number) {
    for (const entity of this._entities) {
      entity[1].Update(time, delta);
    }
  }

  public DestroyEntity(name: string) {
    this._entities.get(name)?.Destroy();
    this._entities.delete(name);
    return this;
  }
}

export default EntityManager;
