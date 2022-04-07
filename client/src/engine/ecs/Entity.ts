import Component from "./Component";
import EntityManager from "./EntityManager";
import Observable from "lib/Observable";

class Entity {
  private _entityManager?: EntityManager;
  private _name: string;
  private _components: Map<string, any>;
  private _observables: Map<string, Observable<any>>;

  constructor(name: string) {
    this._name = name;
    this._components = new Map();
    this._observables = new Map();
  }

  public get Name() {
    return this._name;
  }

  public get EntityManager() {
    return this._entityManager;
  }

  public SetEntityManager(em: EntityManager) {
    this._entityManager = em;
  }

  public AddComponent(component: Component, customName?: string) {
    component.SetEntity(this);
    this._components.set(customName ?? component.constructor.name, component);
    component.OnAdd();
    return this;
  }

  public GetComponent<T extends Component>(name: string): T | undefined {
    return this._components.get(name);
  }

  public Update(time: number) {
    for (const comp of this._components) {
      comp[1].OnUpdate(time);
    }
  }

  public Destroy() {
    for (const comp of this._components) {
      comp[1].OnDestroy();
    }
  }

  public AddObservable<T>(name: string, observable: Observable<T>) {
    this._observables.set(name, observable);
    return this;
  }

  public GetObservable<T>(name: string): Observable<T> | undefined {
    return this._observables.get(name);
  }

  public RemoveObservable(name: string) {
    this._observables.delete(name);
    return this;
  }
}

export default Entity;
