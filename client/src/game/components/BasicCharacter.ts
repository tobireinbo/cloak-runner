import Component from "engine/ecs/Component";
import { CONFIG } from "game/config";
import { PerspectiveCamera, Vector3 } from "three";
import { Capsule } from "three/examples/jsm/math/Capsule";
import { Octree } from "three/examples/jsm/math/Octree";
import InputController from "./InputController";

class BasicCharacter extends Component {
  private _collider: Capsule;
  private _onFloor: boolean;
  private _velocity: Vector3;
  private _direction: Vector3;

  constructor(
    private params: {
      octree: Octree;
      inputs: InputController;
      camera: PerspectiveCamera;
    }
  ) {
    super();

    this._collider = new Capsule(
      new Vector3(0, 0.35, 0),
      new Vector3(0, 1, 0),
      0.35
    );
    this._velocity = new Vector3();
    this._direction = new Vector3();
    this._onFloor = false;

    window.addEventListener("mousemove", (event) => {
      if (document.pointerLockElement === document.body) {
        params.camera.rotation.y -= event.movementX / 500;
        params.camera.rotation.x -= event.movementY / 500;
      }
    });
  }

  public OnUpdate(time: number): void {
    const delta = Math.min(0.05, time) / 5;

    this._controls(delta);
    this._update(delta);
  }

  private _controls(time: number) {
    const keys = this.params.inputs.Keys;
    let groundSpeed = CONFIG.player.movementSpeed.onGround;
    if (keys.shift) {
      groundSpeed = CONFIG.player.movementSpeed.sprint;
    }

    const speedDelta =
      time * (this._onFloor ? groundSpeed : CONFIG.player.movementSpeed.inAir);
    if (keys.forward) {
      this._velocity.add(this._getForwardVector().multiplyScalar(speedDelta));
    }
    if (keys.back) {
      this._velocity.add(this._getForwardVector().multiplyScalar(-speedDelta));
    }
    if (keys.left) {
      this._velocity.add(this._getSideVector().multiplyScalar(-speedDelta));
    }
    if (keys.right) {
      this._velocity.add(this._getSideVector().multiplyScalar(speedDelta));
    }
    if (this._onFloor) {
      if (keys.jump) {
        this._velocity.y = CONFIG.player.jump.velocity;
      }
    }
  }

  private _update(time: number) {
    let damping = Math.exp(-4 * time) - 1;
    if (!this._onFloor) {
      this._velocity.y -= CONFIG.world.gravity * time;
      damping *= 0.1;
    }

    this._velocity.addScaledVector(this._velocity, damping);
    const deltaPosition = this._velocity.clone().multiplyScalar(time);
    this._collider.translate(deltaPosition);

    this._worldCollision();
    this.params.camera.position.copy(this._collider.end);
  }

  private _worldCollision() {
    const result = this.params.octree.capsuleIntersect(this._collider);
    this._onFloor = false;
    if (result) {
      this._onFloor = result.normal.y > 0;
      if (!this._onFloor) {
        this._velocity.addScaledVector(
          result.normal,
          -result.normal.dot(this._velocity)
        );
      }

      this._collider.translate(result.normal.multiplyScalar(result.depth));
    }
  }

  private _getForwardVector() {
    this.params.camera.getWorldDirection(this._direction);
    this._direction.y = 0;
    this._direction.normalize();

    return this._direction;
  }

  private _getSideVector() {
    this.params.camera.getWorldDirection(this._direction);
    this._direction.y = 0;
    this._direction.normalize();
    this._direction.cross(this.params.camera.up);

    return this._direction;
  }
}

export default BasicCharacter;
