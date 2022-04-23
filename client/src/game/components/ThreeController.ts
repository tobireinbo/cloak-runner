import Component from "engine/ecs/Component";
import RenderPixelatedPass from "engine/three/PixelPass";

import {
  AmbientLight,
  FogExp2,
  HemisphereLight,
  MathUtils,
  Mesh,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  sRGBEncoding,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import * as CANNON from "cannon-es";
import { GameStates } from "engine/ecs/Game";
import { Octree } from "three/examples/jsm/math/Octree";
import { Sky } from "three/examples/jsm/objects/Sky";

class ThreeController extends Component {
  private _root: HTMLElement;
  public Renderer?: WebGLRenderer;
  public Camera?: PerspectiveCamera;
  public Scene?: Scene;
  public Ground?: Mesh;
  public Composer?: EffectComposer;
  private _physicsWorld?: CANNON.World;
  private _physicsBodies: Array<Object3D>;
  public Octree: Octree;

  constructor(root: HTMLElement) {
    super();

    this._root = root;
    this._physicsBodies = [];
    this.Octree = new Octree();
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
    this.Camera.rotation.order = "YXZ";
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

  private _setupEffects() {
    if (!this.Renderer || !this.Scene || !this.Camera) {
      console.log("can't setup effects");
      return;
    }
    this.Composer = new EffectComposer(this.Renderer);
    //this.Composer.addPass(new RenderPass(this.Scene, this.Camera));
    let renderResolution = new Vector2(
      window.innerWidth,
      window.innerHeight
    ).divideScalar(2);

    this.Composer.addPass(
      new RenderPixelatedPass(renderResolution, this.Scene, this.Camera)
    );
  }

  private _setupSky() {
    const sky = new Sky();
    sky.scale.setScalar(450000);
    this.Scene?.add(sky);

    const sun = new Vector3();

    /// GUI

    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.5,
      elevation: 2,
      azimuth: 180,
    };

    function guiChanged() {
      const uniforms = sky.material.uniforms;
      uniforms["turbidity"].value = effectController.turbidity;
      uniforms["rayleigh"].value = effectController.rayleigh;
      uniforms["mieCoefficient"].value = effectController.mieCoefficient;
      uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

      const phi = MathUtils.degToRad(90 - effectController.elevation);
      const theta = MathUtils.degToRad(effectController.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      uniforms["sunPosition"].value.copy(sun);
    }

    guiChanged();
  }

  private _onResize = () => {
    if (!this.Camera || !this.Composer || !this.Renderer) {
      return;
    }
    this.Camera.aspect = window.innerWidth / window.innerHeight;
    this.Camera.updateProjectionMatrix();

    this.Renderer.setSize(window.innerWidth, window.innerHeight);
    this.Composer.setSize(window.innerWidth, window.innerHeight);
  };

  public OnAdd(): void {
    //this._setupPhysics();
    this._setupRenderer();
    this._setupCamera();
    this._setupScene();
    this._setupLights();
    this._setupSky();
    this._setupEffects();

    window.addEventListener("resize", this._onResize);
  }

  public OnUpdate(time: number): void {
    if (this.Game?.State.data === GameStates.LOBBY) {
      return;
    }
    if (this.Renderer && this.Scene && this.Camera) {
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
    this.Scene?.add(object);
    if (physicsBody) {
      this._physicsWorld?.addBody(physicsBody);
      this._physicsBodies.push(object);
    }
  }
}

export default ThreeController;
