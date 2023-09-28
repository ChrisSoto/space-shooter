import { mat4 } from "gl-matrix";
import { InputManager } from "../core/input-manager";

export interface CameraTransform {
  x: number,
  y: number,
  rotation: number,
  zoom: number;
}

export class Camera3 {
  private transform: CameraTransform;
  constructor(
    public gl: WebGLRenderingContext,
    public width: number, public height: number) {

    this.transform = {
      x: 0,
      y: 0,
      rotation: 0,
      zoom: 1,
    };
    // const projection = mat4.create();
    // this.view = mat4.lookAt(mat4.create(), [0, 0, 1], [0, 0, 0], [0, 1, 0]);
    // this.projection = mat4.ortho(projection, 0, this.canvas.clientWidth, this.canvas.clientHeight, 0, -1, 1);
  }

  public update(inputManager: InputManager, dt: number) {
    if (inputManager.isKeyDown("w")) {
      this.transform.y += -1 * dt;
    }
    if (inputManager.isKeyDown("s")) {
      this.transform.y += 1 * dt;
    }
    if (inputManager.isKeyDown("a")) {
      this.transform.x += -1 * dt;
    }
    if (inputManager.isKeyDown("d")) {
      this.transform.x += 1 * dt;
    }

    if (inputManager.isKeyDown("z")) {
      this.transform.zoom += 0.01 * dt;
    }
    if (inputManager.isKeyDown("x")) {
      this.transform.zoom += -0.01 * dt;
    }
  }

  public updateProjectionView() {
    const view = mat4.lookAt(mat4.create(), [0, 0, 1], [0, 0, 0], [0, 1, 0])
    const projection = mat4.create();
    mat4.ortho(projection, 0, this.width, this.height, 0, -1, 1);
    mat4.translate(projection, projection, [this.transform.x, this.transform.y, 0]);
    mat4.rotateX(projection, projection, 0);
    mat4.rotateY(projection, projection, 0);
    mat4.rotateZ(projection, projection, this.degToRad(this.transform.rotation));
    mat4.scale(projection, projection, [this.transform.zoom, this.transform.zoom, 0]);
    mat4.invert(projection, projection);
    return mat4.mul(projection, projection, view);
  }

  public clear() {
    this.gl.clearColor(0.9, 0.9, 0.9, 1);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  private degToRad(d: number) {
    return d * Math.PI / 180;
  }
}