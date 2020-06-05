//
// based on PerspectiveCamera from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from '../../math/Matrix4.js';
import { Camera } from './Camera.js';

export class PerspectiveCamera extends Camera {
	verticalFov: number;
	zoom: number;
	near: number;
	far: number;

	constructor(
		verticalFov: number,
		near: number,
		far: number,
		zoom: number = 1.0,
	) {
		super();

		this.verticalFov = verticalFov;
		this.near = near;
		this.far = far;
		this.zoom = zoom;
	}

	getProjection(viewAspectRatio: number = 1.0): Matrix4 {
		let height =
			(2.0 * this.near * Math.tan((this.verticalFov * Math.PI) / 180.0)) /
			this.zoom;
		let width = height * this.pixelAspectRatio * viewAspectRatio;

		let left = -width * 0.5;
		let right = left + width;

		let top = -height * 0.5;
		let bottom = -top + height;

		return new Matrix4().makePerspectiveProjection(
			left,
			right,
			top,
			bottom,
			this.near,
			this.far,
		);
	}
}