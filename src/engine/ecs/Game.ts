import EntityManager from "src/engine/ecs/EntityManager";
import Module from "./Module";

class Game {
  private _prevAnimationFrameTime?: number;
  private _entityManager: EntityManager;

  constructor() {
    this._entityManager = new EntityManager();
    this._init();
  }

  public AddModule(module: Module) {
    module.Define(this._entityManager);
    return this;
  }

  private _init() {}

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
