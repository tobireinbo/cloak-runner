import { Vector3, Quaternion } from "three";

export type CreateBoxProps = {
  mass: number;
  pos: Vector3;
  quat: Quaternion;
  size: Vector3;
};
