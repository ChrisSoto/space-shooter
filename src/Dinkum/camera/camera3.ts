import { mat4, vec2 } from "gl-matrix";
import { InputManager } from "../core/input-manager";
import { CameraInputManager } from "../core/camera-input-manager";

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

  public update(inputManager: InputManager, cameraInputManager: CameraInputManager, dt: number) {


    if (inputManager.panActive) {
      const pan = cameraInputManager.pan();
      this.transform.x = pan[0];
      this.transform.y = pan[1];
    }

    if (inputManager.wheel.forward) {
      this.transform.zoom += 0.01 * dt;
      inputManager.wheel.forward = false;
    }
    if (inputManager.wheel.backward) {
      this.transform.zoom += -0.01 * dt;
      inputManager.wheel.backward = false;
    }
  }

  public updateProjectionView() {

    mat4.ortho(this.projection, 0, this.width, this.height, 0, -1, 1);
    mat4.translate(this.projection, this.projection, [this.transform.x, this.transform.y, 0]);
    // mat4.translate(projection, projection, [this.transform.x, this.transform.y, 0]);
    // mat4.rotateX(projection, projection, 0);
    // mat4.rotateY(projection, projection, 0);
    // mat4.rotateZ(projection, projection, this.degToRad(this.transform.rotation));
    // mat4.scale(projection, projection, [this.transform.zoom, this.transform.zoom, 0]);
    // mat4.invert(projection, projection);
    mat4.mul(this.projectionViewMatrix, this.projection, this.view);
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