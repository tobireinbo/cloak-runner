import Component from "src/engine/ecs/Component";
import RigidBody from "src/engine/physics/RigidBody";
import { AmmoLib } from "src/main";
import {
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from "three";
import InputController from "./InputController";

class TestCube extends Component {
  public Body?: Object3D;
  private _tmpPos: any;
  private _tmpQuat: any;
  private _tmpTrans: any;
  private _ammoTmpPos: any;
  private _ammoTmpQuat: any;
  constructor() {
    super();

    this._tmpPos = new Vector3();
    this._tmpQuat = new Quaternion();
    this._tmpTrans = new AmmoLib.btTransform();
    this._ammoTmpPos = new AmmoLib.btVector3();
    this._ammoTmpQuat = new AmmoLib.btQuaternion();
  }

  public OnAdd(): void {
    const geometry = new BoxGeometry(30, 30, 30);
    const material = new MeshPhongMaterial({
      color: "#ff0000",
      depthWrite: false,
    });
    this.Body = new Mesh(geometry, material);
    this.Body.receiveShadow = true;
    this.Body.castShadow = true;
    this.Body.position.setY(15);

    const rb = new RigidBody(AmmoLib);
    rb.CreateBox(
      {
        mass: 1,
        pos: this.Body.position,
        quat: this.Body.quaternion,
        size: new Vector3(30, 30, 30),
      },
      true
    );
    rb.Body.setFriction(4);
    rb.Body.setRollingFriction(10);

    this.Body.userData.rb = rb;
  }

  public OnUpdate(time: number): void {
    this.$$TestMovement();
  }

  private $$TestMovement() {
    const inputController = this.Entity?.GetComponent<InputController>(
      InputController.name
    );
    const inputs = inputController?.Keys;

    if (!inputs) {
      return;
    }

    let scalingFactor = 0.3;

    let moveX = inputs.left - inputs.right;
    let moveZ = inputs.forward - inputs.back;
    let moveY = 0;

    let translateFactor = this._tmpPos.set(moveX, moveY, moveZ);

    translateFactor.multiplyScalar(scalingFactor);

    this.Body?.translateX(translateFactor.x);
    this.Body?.translateY(translateFactor.y);
    this.Body?.translateZ(translateFactor.z);

    this.Body?.getWorldPosition(this._tmpPos);
    this.Body?.getWorldQuaternion(this._tmpQuat);

    let physicsBody: RigidBody | undefined = this.Body?.userData.rb;

    let ms = physicsBody?.MotionState;
    if (ms) {
      this._ammoTmpPos.setValue(this._tmpPos.x, this._tmpPos.y, this._tmpPos.z);
      this._ammoTmpQuat.setValue(
        this._tmpQuat.x,
        this._tmpQuat.y,
        this._tmpQuat.z,
        this._tmpQuat.w
      );

      this._tmpTrans.setIdentity();
      this._tmpTrans.setOrigin(this._ammoTmpPos);
      this._tmpTrans.setRotation(this._ammoTmpQuat);

      ms.setWorldTransform(this._tmpTrans);
    }
  }
}

export default TestCube;
