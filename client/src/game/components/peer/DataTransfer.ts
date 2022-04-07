import Component from "engine/ecs/Component";

class DataTransfer extends Component {
  private _actions: Map<string, (data: any) => void>;
  constructor() {
    super();
    this._actions = new Map();
  }

  public OnAdd(): void {}

  public OnUpdate(time: number): void {}
}
