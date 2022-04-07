import Component from "src/engine/ecs/Component";
import RenderPixelatedPass from "src/engine/three/PixelPass";

import {
  AmbientLight,
  FogExp2,
  HemisphereLight,
  Mesh,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  sRGBEncoding,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import * as CANNON from "cannon-es";
import { GameStates } from "src/engine/ecs/Game";

class ThreeController extends Component {
  private _root: HTMLElement;
  public Renderer?: WebGLRenderer;
  public Camera?: PerspectiveCamera;
  public Scene?: Scene;
  public Ground?: Mesh;
  public Composer?: EffectComposer;
  private _controls?: OrbitControls;
  private _physicsWorld?: CANNON.World;
  private _physicsBodies: Array<Object3D>;

  constructor(root: HTMLElement) {
    super();

    this._root = root;
    this._physicsBodies = [];
  }

  private _setupPhysics() {
    this._physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -20, 0),
    });
  }

  private _setupRenderer() {
    this.Renderer = new WebGLRenderer({ antialias: false });
    this.Renderer.outputEncoding = sRGBEncoding;
    this.Renderer.shadowMap.enabled = true;
    this.Renderer.shadowMap.type = PCFSoftShadowMap;
    this.Renderer.setPixelRatio(window.devicePixelRatio);
    this.Renderer.setSize(window.innerWidth, window.innerHeight);
    this.Renderer.domElement.id = "three";
    this._root.appendChild(this.Renderer.domElement);
  }

  private _setupCamera() {
    const fov = 90;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000.0;
    this.Camera = new PerspectiveCamera(fov, aspect, near, far);

    //this._controls = new OrbitControls(this.Camera, this.Renderer?.domElement);
  }

  private _setupScene() {
    this.Scene = new Scene();
    this.Scene.fog = new FogExp2(0xefd1b5, 0.0055);
  }

  private _setupLights() {
    const light = new PointLight(0x8088b3, 0.5);
    light.position.set(0, 200, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 10000.0;
    const ambientLight = new AmbientLight(0xffffff, 0.2);
    const hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.8);
    hemiLight.position.set(0, 20, 0);

    this.Scene?.add(ambientLight);
    this.Scene?.add(hemiLight);
    this.Scene?.add(light);
  }

  private _SetupEffects() {
    if (!this.Renderer || !this.Scene || !this.Camera) {
      console.log("can't setup effects");
      return;
    }
    this.Composer = new EffectComposer(this.Renderer);
    let renderResolution = new Vector2(
      window.innerWidth,
      window.innerHeight
    ).divideScalar(1);

    this.Composer.addPass(
      new RenderPixelatedPass(renderResolution, this.Scene, this.Camera)
    );
  }

  public OnAdd(): void {
    this._setupPhysics();
    this._setupRenderer();
    this._setupCamera();
    this._setupScene();
    this._setupLights();
    this._SetupEffects();
  }

  public OnUpdate(time: number): void {
    if (this.Renderer && this.Scene && this.Camera) {
      this._controls?.update();
      this._physicsWorld?.fixedStep();

      for (const physicsBody of this._physicsBodies) {
        physicsBody.position.copy(physicsBody.userData.physicsBody.position);
        /*physicsBody.quaternion.copy(
          physicsBody.userData.physicsBody.quaternion
        );*/
      }

      this.Composer?.render();
    }
  }

  public AddBody(object?: Object3D) {
    if (!object) {
      return;
    }
    const physicsBody = object.userData.physicsBody;
    if (physicsBody) {
      this._physicsWorld?.addBody(physicsBody);
    }
    this.Scene?.add(object);
    this._physicsBodies.push(object);
  }
}

export default ThreeController;
