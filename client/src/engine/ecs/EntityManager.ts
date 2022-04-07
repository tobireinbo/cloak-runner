import Entity from "./Entity";
import Game from "./Game";

class EntityManager {
  private _entities: Map<string, Entity>;
  private _game?: Game;

  constructor() {
    this._entities = new Map();
  }

  public get Game() {
    return this._game;
  }

  public SetGame(game: Game) {
    this._game = game;
  }

  public AddEntity(entity: Entity) {
    entity.SetEntityManager(this);
    this._entities.set(entity.Name, entity);
  }

  public GetEntity(name: string) {
    return this._entities.get(name);
  }

  public Update(time: number) {
    for (const entity of this._entities) {
      entity[1].Update(time);
    }
  }

  public DestroyEntity(name: string) {
    this._entities.get(name)?.Destroy();
    this._entities.delete(name);
    return this;
  }
}

export default EntityManager;
