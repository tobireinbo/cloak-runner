/*
    https://github.com/pmndrs/cannon-es/blob/master/examples/js/PointerLockControlsCannon.js
*/

import Component from "src/engine/ecs/Component";
import { Euler, Object3D, PerspectiveCamera, Quaternion, Vector3 } from "three";
import * as CANNON from "cannon-es";
import InputController from "./InputController";
import { cannonVec3ToThreeVec3 } from "src/engine/physics/helper/translators";

class FirstPersonPlayer extends Component {
  private _velFactor = 0.2;
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
  }

  public OnDestroy(): void {
    document.removeEventListener("mousemove", this._onMouseMove);
  }

  public OnUpdate(time: number): void {
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
    const { movementX, movementY } = event;
    this._yawObject.rotation.y -= movementX * 0.002;
    this._pitchObject.rotation.x -= movementY * 0.002;

    this._pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this._pitchObject.rotation.x)
    );
  };
}

export default FirstPersonPlayer;
