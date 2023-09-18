import { mat4, vec2, vec3 } from 'gl-matrix';

export class Camera {
  private projection!: mat4
  private view!: mat4;
  public state = {
    x: 100,
    y: 100,
    rotation: 0.5,
    zoom: 20,
  };
  public projectionViewMatrix: mat4;

  constructor(public gl: WebGL2RenderingContext, public width: number, public height: number) {
    this.projectionViewMatrix = mat4.create();
  }

  private makeCameraMatrix() {
    const zoomScale = 1 / this.state.zoom;
    let cameraMat = mat4.create();
    cameraMat = mat4.translate(cameraMat, this.projection, [this.state.x, this.state.y, 0]);
    const origin = vec2.fromValues(0.5, 0.5);
    cameraMat = mat4.rotate(cameraMat, cameraMat, this.state.rotation, [origin[0], origin[1], 0]);
    cameraMat = mat4.scale(cameraMat, cameraMat, [zoomScale, zoomScale, 0]);
    return cameraMat;
  }

  public update() {
    // imagine a camera man
    // first vec3 = where is the camera manp
    // secon vec3 = what is he looking at (into z)
    // third vec3 = which way is up

    this.view = mat4.lookAt(mat4.create(), [0, 0, 1], [0, 0, 0], [0, 1, 0])
    // this.view = mat4.create();

    this.projection = mat4.ortho(mat4.create(), 0, this.width, this.height, 0, -1, 1);
    const cMatrix = this.makeCameraMatrix();
    mat4.invert(this.view, cMatrix)
    mat4.mul(this.projectionViewMatrix, this.projection, this.view);
  }

  public clear() {
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clearColor(0.8, 0.8, 0.8, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}