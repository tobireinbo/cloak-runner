import { ObserverAction } from "./Observer.types";

class Observer<T> {
  private _data: T;
  private _subscriptions: Array<ObserverAction<T>>;

  constructor(initialData: T) {
    this._data = initialData;

    this._subscriptions = [];
  }

  get data() {
    return this._data;
  }

  subscribe(action: ObserverAction<T>) {
    this._subscriptions.push(action);
  }

  setData(newData: T) {
    this.setDataUndetected(newData);
    this._updateSubscriptions();
  }

  setDataUndetected(newData: T) {
    this._data = newData;
  }

  private _updateSubscriptions() {
    for (const subscription of this._subscriptions) {
      subscription(this._data);
    }
  }
}

export default Observer;
