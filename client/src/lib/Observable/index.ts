import { ObservableAction, ObservableSetter } from "./Observable.types";
import { v4 } from "uuid";

class Observable<T> {
  private _data: T;
  private _subscriptions: Map<string, ObservableAction<T>>;

  constructor(initialData: T) {
    this._data = initialData;

    this._subscriptions = new Map();
  }

  get data() {
    return this._data;
  }

  /**
   * subscribe to the observable
   *
   * the subscription action is defined with a callback function which is called on every broadcast
   * @param action
   * @returns
   */
  subscribe(action: ObservableAction<T>) {
    const key = v4();
    this._subscriptions.set(key, action);

    const resubscribe = () => {
      this.subscribe(action);
    };

    const unsubscribe = () => {
      this._unsubscribeAtKey(key);
      return resubscribe;
    };

    return unsubscribe;
  }

  /**
   * updates the observable data without broadcasting it
   * @param data
   * @returns
   */
  set(data: ObservableSetter<T>) {
    if (data instanceof Function) {
      this._data = data(this._data);
    } else {
      this._data = data;
    }
    return this;
  }

  /**
   * broadcasts the observable data to all subscribers
   *
   * is new data provided then it will be updated first and then broadcasted after
   * @returns
   */
  broadcast(data?: ObservableSetter<T>) {
    if (data) {
      this.set(data);
    }
    this._updateSubscriptions();
    return this;
  }

  /**
   * trigger the action of a single subscription
   * @param key
   * @returns
   */
  triggerByKey(key: string) {
    const action = this._subscriptions.get(key);
    action?.(this._data);
    return this;
  }

  private _updateSubscriptions() {
    for (const subscription of this._subscriptions) {
      subscription[1](this._data);
    }
  }

  private _unsubscribeAtKey(key: string) {
    this._subscriptions.delete(key);
  }
}

export default Observable;
