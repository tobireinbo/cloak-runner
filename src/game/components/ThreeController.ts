import Component from "src/engine/ecs/Component";
import RenderPixelatedPass from "src/engine/three/PixelPass";

import {
  AmbientLight,
  BoxGeometry,
  FogExp2,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  sRGBEncoding,
  Vector2,
  WebGLRenderer,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

class ThreeController extends Component {
  private _root: HTMLElement;
  public Renderer?: WebGLRenderer;
  public Camera?: PerspectiveCamera;
  public Scene?: Scene;
  public Ground?: Mesh;
  public Composer?: EffectComposer;

  constructor(root: HTMLElement) {
    super();

    this._root = root;
  }

  public OnAdd(): void {
    //RENDERER
    this.Renderer = new WebGLRenderer({ antialias: false });
    this.Renderer.outputEncoding = sRGBEncoding;
    this.Renderer.shadowMap.enabled = true;
    this.Renderer.shadowMap.type = PCFSoftShadowMap;
    this.Renderer.setPixelRatio(window.devicePixelRatio);
    this.Renderer.setSize(window.innerWidth, window.innerHeight);
    this.Renderer.domElement.id = "three";

    this._root.appendChild(this.Renderer.domElement);

    //CAMERA
    const fov = 90;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 1000.0;

    this.Camera = new PerspectiveCamera(fov, aspect, near, far);
    this.Camera.position.set(50, 50, 50);

    //SCENE
    this.Scene = new Scene();

    //FOG
    this.Scene.fog = new FogExp2(0xefd1b5, 0.0055);

    //LIGHTS
    const light = new PointLight(0x8088b3, 0.5);
    light.position.set(0, 200, 0);
    const ambientLight = new AmbientLight(0xffffff, 0.2);
    const hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.8);
    hemiLight.position.set(0, 20, 0);

    this.Scene.add(ambientLight);
    this.Scene.add(hemiLight);
    this.Scene.add(light);

    //GROUND
    this.Ground = new Mesh(
      new BoxGeometry(20000, 1, 20000),
      new MeshPhongMaterial({ color: "#102300", depthWrite: false })
    );
    this.Ground.receiveShadow = true;
    this.Scene.add(this.Ground);

    //EFFECT
    this.Composer = new EffectComposer(this.Renderer);
    let renderResolution = new Vector2(
      window.innerWidth,
      window.innerHeight
    ).divideScalar(2);

    this.Composer.addPass(
      new RenderPixelatedPass(renderResolution, this.Scene, this.Camera)
    );
  }

  public OnUpdate(time: number, delta: number): void {
    if (this.Renderer && this.Scene && this.Camera) {
      this.Composer?.render();
    }
  }

  public AddObject(object: Object3D) {
    this.Scene?.add(object);
  }
}

export default ThreeController;
