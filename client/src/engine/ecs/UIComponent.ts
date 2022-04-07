import Component from "./Component";

class UIComponent extends Component {
  private _parent: HTMLElement;
  element?: HTMLElement;
  constructor(parent: HTMLElement) {
    super();

    this._parent = parent;
  }

  public Mount() {
    if (!this.element) {
      return;
    }
    this._parent.appendChild(this.element);
  }

  public UnMount() {
    if (!this.element) {
      return;
    }
    this._parent.removeChild(this.element);
  }
}

export default UIComponent;
