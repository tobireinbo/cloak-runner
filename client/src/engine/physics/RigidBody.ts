import { Quaternion, Vector3 } from "three";

class RigidBody {
  private _transform: any;
  private _shape: any;
  private _inertia: any;
  private _info: any;
  private _body: any;
  private _motionState: any;
  constructor(private AmmoLib: any) {}

  public get MotionState() {
    return this._motionState;
  }

  public get Body() {
    return this._body;
  }

  public CreateBox(params: {
    mass: number;
    pos: Vector3;
    quat: Quaternion;
    size: Vector3;
  }): void {
    const { pos, quat, mass, size } = params;

    this._transform = new this.AmmoLib.btTransform();
    this._transform.setIdentity();
    this._transform.setOrigin(new this.AmmoLib.btVector3(pos.x, pos.y, pos.z));
    this._transform.setRotation(
      new this.AmmoLib.btQuaternion(quat.x, quat.y, quat.z, quat.w)
    );
    this._motionState = new this.AmmoLib.btDefaultMotionState(this._transform);

    const btSize = new this.AmmoLib.btVector3(
      size.x * 0.5,
      size.y * 0.5,
      size.z * 0.5
    );
    this._shape = new this.AmmoLib.btBoxShape(btSize);
    this._shape.setMargin(0.005);
    this._inertia = new this.AmmoLib.btVector3(0, 0, 0);

    if (mass > 0) {
      this._shape.calculateLocalInertia(mass, this._inertia);
    }

    this._info = new this.AmmoLib.btRigidBodyConstructionInfo(
      mass,
      this._motionState,
      this._shape,
      this._inertia
    );
    this._body = new this.AmmoLib.btRigidBody(this._info);

    this.AmmoLib.destroy(btSize);
  }
}

export default RigidBody;
