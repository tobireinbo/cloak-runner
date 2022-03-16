class Tree<T> {
  private _id: number;
  private _data?: T;
  private _children: Array<Tree<T>>;

  static #idCounter: number = 0;

  constructor(initialData?: T, initialChildren?: Array<Tree<T>>) {
    this._id = Tree.#idCounter;
    Tree.#idCounter += 1;

    this._data = initialData;
    this._children = initialChildren ?? [];
  }

  get children() {
    return this._children;
  }

  get id() {
    return this._id;
  }

  get data() {
    return this._data;
  }

  addChild(node: Tree<T>) {
    this._children.push(node);

    return this;
  }

  findById(id: number) {
    if (this._id === id) {
      return this;
    }

    let found: Tree<T> | undefined;

    if (!this._children) {
      return;
    }

    for (const child of this._children) {
      const result = child.findById(id);

      if (result) {
        found = result;
      }
    }

    return found;
  }
}

export default Tree;
