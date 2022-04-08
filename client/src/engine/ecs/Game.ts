import EntityManager from "engine/ecs/EntityManager";
import Observable from "lib/Observable";
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
    this._entityManager.SetGame(this);
    this.State = new Observable<GameStates>(GameStates.LOBBY);
    this._init();
  }

  public get EntityManager() {
    return this._entityManager;
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

      this._step(time - this._prevAnimationFrameTime);
      this._animate();
      this._prevAnimationFrameTime = time;
    });
  }

  private _step(timeElapsed: number) {
    this._entityManager.Update(timeElapsed);
  }
}

export default Game;
