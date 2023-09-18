import { mat4, vec3 } from "gl-matrix";

export class Camera3 {
  private projection: mat4;
  private view: mat4;
  public pan: vec3;
  public zoom: vec3;
  public rotate: vec3;
  constructor(
    public gl: WebGLRenderingContext,
    public canvas: HTMLCanvasElement) {
    this.pan = vec3.create();
    this.zoom = vec3.create();
    this.rotate = vec3.create();
    const projection = mat4.create();
    this.view = mat4.lookAt(mat4.create(), [0, 0, 1], [0, 0, 0], [0, 1, 0]);
    this.projection = mat4.ortho(projection, 0, this.canvas.clientWidth, this.canvas.clientHeight, 0, -1, 1);
  }

  public updateProjectionView() {
    mat4.translate(this.projection, this.projection, this.pan);
    mat4.rotateX(this.projection, this.projection, degToRad(this.rotate[0]));
    mat4.rotateY(this.projection, this.projection, degToRad(this.rotate[1]));
    mat4.rotateZ(this.projection, this.projection, degToRad(this.rotate[2]));
    mat4.scale(this.projection, this.projection, this.zoom);
    return mat4.mul(mat4.create(), this.projection, this.view);
  }
}

function degToRad(d: number) {
  return d * Math.PI / 180;
}