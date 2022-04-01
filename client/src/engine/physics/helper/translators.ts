import * as CANNON from "cannon-es";
import * as THREE from "three";

export function cannonVec3ToThreeVec3(vec: CANNON.Vec3) {
  return new THREE.Vector3(vec.x, vec.y, vec.z);
}

export function threeVec3ToCannonVec3(vec: THREE.Vector3) {
  return new CANNON.Vec3(vec.x, vec.y, vec.z);
}

export function threeQuatToCannonQuat(quat: THREE.Quaternion) {
  return new CANNON.Quaternion(quat.x, quat.y, quat.z, quat.w);
}
