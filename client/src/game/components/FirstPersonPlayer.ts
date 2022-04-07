/*
    https://github.com/pmndrs/cannon-es/blob/master/examples/js/PointerLockControlsCannon.js
*/

import Component from "engine/ecs/Component";
import { Euler, Object3D, PerspectiveCamera, Quaternion, Vector3 } from "three";
import * as CANNON from "cannon-es";
import InputController from "./InputController";
import { cannonVec3ToThreeVec3 } from "engine/physics/helper/translators";
import { GameStates } from "engine/ecs/Game";

class FirstPersonPlayer extends Component {
  private _enabled = false;
  private _velFactor = 0.1;
  private _jumpVel = 20;
  private _pitchObject = new Object3D();
  private _yawObject = new Object3D();
  private _quat = new Quaternion();
  private _contactNormal = new CANNON.Vec3();
  private _upAxis = new CANNON.Vec3(0, 1, 0);
  private _velocity: CANNON.Vec3;
  private _inputVelocity = new Vector3();
  private _euler = new Euler();
  private _canJump = false;
  private _isLocked = false;

  constructor(
    public args: {
      camera: PerspectiveCamera;
      body: CANNON.Body;
    }
  ) {
    super();
    this._velocity = args.body.velocity;
    this._yawObject.userData.physicsBody = args.body;
  }

  get Object() {
    return this._yawObject;
  }

  public OnAdd(): void {
    const gameState = this.Entity?.EntityManager?.Game?.State;
    if (gameState?.data === GameStates.MATCH_PROGRESS) {
      this._enabled = true;
    }
    gameState?.subscribe((state) => {
      console.log(state);
      if (state === GameStates.MATCH_PROGRESS) {
        this._enabled = true;
      } else {
        this._enabled = false;
      }
    });

    this._pitchObject.add(this.args.camera);
    this._yawObject.position.y = 2;
    this._yawObject.add(this._pitchObject);

    this.args.body.addEventListener("collide", (e: any) => {
      let contact = e.contact;
      if (contact.bi.id === this.args.body.id) {
        contact.ni.negate(this._contactNormal);
      } else {
        this._contactNormal.copy(contact.ni);
      }

      if (this._contactNormal.dot(this._upAxis) > 0.5) {
        this._canJump = true;
      }
    });

    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("pointerlockchange", this._onPointerlockChange);
    document.addEventListener("pointerlockerror", this._onPointerlockError);
  }

  public OnDestroy(): void {
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener(
      "pointerlockchange",
      this._onPointerlockChange
    );
    document.removeEventListener("pointerlockerror", this._onPointerlockError);
  }

  public OnUpdate(time: number): void {
    if (!this._enabled) {
      return;
    }

    const inputs = this.Entity?.GetComponent<InputController>(
      InputController.name
    );

    if (!inputs) {
      return;
    }

    this._inputVelocity.set(0, 0, 0);

    if (inputs.Keys.forward) {
      this._inputVelocity.z = -this._velFactor * time;
    }
    if (inputs.Keys.back) {
      this._inputVelocity.z = this._velFactor * time;
    }
    if (inputs.Keys.left) {
      this._inputVelocity.x = -this._velFactor * time;
    }
    if (inputs.Keys.right) {
      this._inputVelocity.x = this._velFactor * time;
    }
    if (inputs.Keys.jump) {
      if (this._canJump) {
        this._velocity.y = this._jumpVel;
      }
      this._canJump = false;
    }

    this._euler.x = this._pitchObject.rotation.x;
    this._euler.y = this._yawObject.rotation.y;
    this._euler.order = "XYZ";
    this._quat.setFromEuler(this._euler);
    this._inputVelocity.applyQuaternion(this._quat);

    this._velocity.x += this._inputVelocity.x;
    this._velocity.z += this._inputVelocity.z;

    this._yawObject.position.copy(
      cannonVec3ToThreeVec3(this.args.body.position)
    );
  }

  private _onMouseMove = (event: MouseEvent) => {
    if (!this._enabled) {
      return;
    }

    const { movementX, movementY } = event;
    this._yawObject.rotation.y -= movementX * 0.002;
    this._pitchObject.rotation.x -= movementY * 0.002;

    this._pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this._pitchObject.rotation.x)
    );
  };

  private _onPointerlockChange = () => {
    if (document.pointerLockElement) {
      this._isLocked = true;
    } else {
      this._isLocked = false;
    }
  };

  private _onPointerlockError = () => {
    console.error("Unable to use Pointer Lock API");
  };
}

export default FirstPersonPlayer;
