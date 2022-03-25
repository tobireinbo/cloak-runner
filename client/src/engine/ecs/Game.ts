import EntityManager from "src/engine/ecs/EntityManager";
import Observable from "src/lib/Observable";
import Module from "./Module";

export enum GameStates {
  MENU = "menu",
  LOBBY = "lobby",
  MATCH_START = "match_start",
  MATCH_PROGRESS = "match_progress",
  MATCH_END = "match_end",
}
class Game {
  private _prevAnimationFrameTime?: number;
  private _entityManager: EntityManager;
  public State: Observable<GameStates>;

  constructor() {
    this._entityManager = new EntityManager();
    this.State = new Observable<GameStates>(GameStates.MENU);
    this._init();
  }

  public AddModule(module: Module) {
    module.SetGame(this);
    module.Define(this._entityManager);
    return this;
  }

  private _init() {
    this._animate();
  }

  private _animate() {
    requestAnimationFrame((time) => {
      if (this._prevAnimationFrameTime === undefined) {
        this._prevAnimationFrameTime = time;
      }

      const delta = Math.min(
        1.0 / 60.0,
        time - this._prevAnimationFrameTime * 0.001
      );

      this._entityManager.Update(time, delta);

      setTimeout(() => {
        this._animate();
      }, 10);
    });
  }
}

export default Game;
