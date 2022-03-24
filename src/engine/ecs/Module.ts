import EntityManager from "./EntityManager";
import Game from "./Game";

class Module {
  private _game?: Game;
  constructor() {}

  public SetGame(game: Game) {
    this._game = game;
  }

  public get Game() {
    return this._game;
  }

  public Define(entityManager: EntityManager) {}
}

export default Module;
