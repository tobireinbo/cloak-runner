import { Pattern } from "./Matcher.types";

class Matcher {
  private _data: Object;
  private _patterns: Array<Pattern<Object>>;

  constructor(data: Object) {
    this._data = data;
    this._patterns = [];
  }

  when(
    data: Pattern<Object>["data"],
    condition: Pattern<Object>["condition"],
    action: Pattern<Object>["action"]
  ) {
    this._patterns.push({ data, action, condition });
  }

  default(action: Pattern<Object>["action"]) {
    let actionCounter = 0;
    for (const pattern of this._patterns) {
      const combinedData = { ...this._data, ...pattern.data };
    }
  }
}
