//
// based on Line3 from Three.js
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable, IHashable } from "../core/types";
import { Vector3 } from "./Vector3";

export class Line3 implements ICloneable<Line3>, IEquatable<Line3>, IHashable {
  constructor(public start = new Vector3(), public end = new Vector3() ) {
  }

  getHashCode(): number {
    return (this.min.getHashCode() * 397) ^ (this.max.getHashCode() | 0);
  }

  set(min: Vector3, max: Vector3): this {
    this.min.copy(min);
    this.max.copy(max);

    return this;
  }

  clone(): Box3 {
    return new Box3().copy(this);
  }

  copy(box: Box3): this {
    this.min.copy(box.min);
    this.max.copy(box.max);

    return this;
  }

  makeEmpty(): this {
    this.min.x = this.min.y = this.min.z = +Infinity;
    this.max.x = this.max.y = this.max.z = -Infinity;

    return this;
  }

  isEmpty(): boolean {
    // this is a more robust check for empty than ( volume <= 0 ) because
    // volume can get positive with two negative axes

    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }

  expandByPoint(point: Vector3): this {
    this.min.min(point);
    this.max.max(point);

    return this;
  },

  expandByVector(vector: Vector3): this {
    this.min.sub(vector);
    this.max.add(vector);

    return this;
  },

  expandByScalar(scalar: number): this {
    this.min.addScalar(-scalar);
    this.max.addScalar(scalar);

    return this;
  },

  intersect(box: Box3): this {
    this.min.max(box.min);
    this.max.min(box.max);

    return this;
  }

  union(box: Box3): this {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  }

  translate(offset: Vector3): this {
    this.min.add(offset);
    this.max.add(offset);

    return this;
  }

  equals(box: Box3): boolean {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}
