import { mat4, vec2 } from "gl-matrix";
import { InputManager } from "../core/input-manager";
import { CameraInputManager } from "../core/camera-input-manager";
import { MathUtil } from "../util/math";

export interface CameraTransform {
  x: number,
  y: number,
  rotation: number,
  zoom: number;
}

export class Camera3 {
  public transform: CameraTransform;
  private view!: mat4;
  public projectionViewMatrix!: mat4;
  private projection!: mat4;
  private beforeZoom!: number[];
  private afterZoom!: number[];
  constructor(
    public gl: WebGLRenderingContext,
    public width: number, public height: number) {
    this.projection = mat4.create();
    this.view = mat4.lookAt(mat4.create(), [0, 0, 1], [0, 0, 0], [0, 1, 0]);
    this.projectionViewMatrix = mat4.create();

    this.transform = {
      x: 0,
      y: 0,
      rotation: 0,
      zoom: 1,
    };
  }

  public updateInput(inputManager: InputManager, cameraInputManager: CameraInputManager) {


    if (inputManager.panActive) {
      const pan = cameraInputManager.pan();
      this.transform.x = pan[0];
      this.transform.y = pan[1];
    }

    if (inputManager.wheel.forward) {
      const newZoom = this.transform.zoom * Math.pow(2, -1 * -0.1);
      const beforeMatrix = mat4.translate(mat4.create(), this.projectionViewMatrix, [cameraInputManager.mousePos[0], cameraInputManager.mousePos[1], 0])
      this.beforeZoom = cameraInputManager.getScreenFromClip([beforeMatrix[12], beforeMatrix[13]])
      this.transform.zoom = Math.max(0.02, Math.min(100, newZoom));
    }

    if (inputManager.wheel.backward) {
      const newZoom = this.transform.zoom * Math.pow(2, 1 * -0.1);
      const beforeMatrix = mat4.translate(mat4.create(), this.projectionViewMatrix, [cameraInputManager.mousePos[0], cameraInputManager.mousePos[1], 0])
      this.beforeZoom = cameraInputManager.getScreenFromClip([beforeMatrix[12], beforeMatrix[13]])
      this.transform.zoom = Math.max(0.02, Math.min(100, newZoom));
    }
  }

  public update(inputManager: InputManager, cameraInputManager: CameraInputManager) {
    this.updateInput(inputManager, cameraInputManager);
    if (inputManager.wheel.forward || inputManager.wheel.backward) {
      const afterMatrix = mat4.translate(mat4.create(), this.projectionViewMatrix, [cameraInputManager.mousePos[0], cameraInputManager.mousePos[1], 0]);
      this.afterZoom = cameraInputManager.getScreenFromClip([afterMatrix[12], afterMatrix[13]]);
      this.transform.x += this.beforeZoom[0] - this.afterZoom[0];
      this.transform.y += this.beforeZoom[1] - this.afterZoom[1];
      inputManager.wheel.forward = false;
      inputManager.wheel.backward = false;
      this.updateProjectionView();
    }
  }

  public updateProjectionView() {
    mat4.ortho(this.projection, 0, this.width, this.height, 0, -1, 1);
    mat4.translate(this.projection, this.projection, [this.transform.x, this.transform.y, 0]);
    mat4.rotateX(this.projection, this.projection, 0);
    mat4.rotateY(this.projection, this.projection, 0);
    mat4.rotateZ(this.projection, this.projection, MathUtil.degToRad(this.transform.rotation));
    mat4.scale(this.projection, this.projection, [this.transform.zoom, this.transform.zoom, 0]);
    mat4.invert(this.projection, this.projection);
    mat4.mul(this.projectionViewMatrix, this.projection, this.view);
  }

  public clear() {
    this.gl.clearColor(0.9, 0.9, 0.9, 1);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

}