import Component from "src/engine/ecs/Component";
import RenderPixelatedPass from "src/engine/three/PixelPass";
import { AmmoLib } from "src/main";

import {
  AmbientLight,
  FogExp2,
  HemisphereLight,
  Mesh,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Quaternion,
  Scene,
  sRGBEncoding,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

class ThreeController extends Component {
  private _root: HTMLElement;
  public Renderer?: WebGLRenderer;
  public Camera?: PerspectiveCamera;
  public Scene?: Scene;
  public Ground?: Mesh;
  public Composer?: EffectComposer;
  private _controls?: OrbitControls;

  private _collisionConfig: any;
  private _dispatcher: any;
  private _broadphase: any;
  private _solver: any;
  private _physicsWorld: any;

  public _rigidBodies: Array<Object3D>;
  private _tempTransform: any;

  constructor(root: HTMLElement) {
    super();

    this._root = root;
    this._rigidBodies = [];
  }

  private _setupPhysics() {
    this._collisionConfig = new AmmoLib.btDefaultCollisionConfiguration();
    this._dispatcher = new AmmoLib.btCollisionDispatcher(this._collisionConfig);
    this._broadphase = new AmmoLib.btDbvtBroadphase();
    this._solver = new AmmoLib.btSequentialImpulseConstraintSolver();
    this._physicsWorld = new AmmoLib.btDiscreteDynamicsWorld(
      this._dispatcher,
      this._broadphase,
      this._solver,
      this._collisionConfig
    );
    this._physicsWorld.setGravity(new AmmoLib.btVector3(0, -10, 0));
    this._tempTransform = new AmmoLib.btTransform();
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
    this.Camera.position.set(0, -50, 20);
    this.Camera.rotateX(Math.PI / 3);

    this._controls = new OrbitControls(this.Camera, this.Renderer?.domElement);
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
    ).divideScalar(2);

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
      this.Composer?.render();
      this._controls?.update();
      this._physicsWorld.stepSimulation(time, 10);

      for (let i = 0; i < this._rigidBodies.length; i++) {
        const current = this._rigidBodies[i];
        current.userData.rb.MotionState.getWorldTransform(this._tempTransform);
        const pos = this._tempTransform.getOrigin();
        const quat = this._tempTransform.getRotation();
        const pos3 = new Vector3(pos.x(), pos.y(), pos.z());
        const quat3 = new Quaternion(quat.x(), quat.y(), quat.z(), quat.w());

        current.position.copy(pos3);
        current.quaternion.copy(quat3);
      }
    }
  }

  public AddBody(object?: Object3D) {
    if (!object) {
      return;
    }
    const rb = object.userData.rb;
    if (rb) {
      this._physicsWorld.addRigidBody(rb.Body);
    }
    this.Scene?.add(object);

    this._rigidBodies.push(object);
  }
}

export default ThreeController;
