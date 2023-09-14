import { mat4 } from 'gl-matrix';

export class Camera {
  private projection!: mat4
  private view!: mat4;

  public projectionViewMatrix: mat4;

  constructor(public gl: WebGL2RenderingContext, public width: number, public height: number) {
    this.projectionViewMatrix = mat4.create();
  }

  public update() {
    // imagine a camera man
    // first vec3 = where is the camera man
    // secon vec3 = what is he looking at (into z)
    // third vec3 = which way is up
    this.view = mat4.lookAt(mat4.create(), [0, 0, 1], [0, 0, 0], [0, 1, 0])
    this.projection = mat4.ortho(mat4.create(), 0, this.width, this.height, 0, -1, 1);

    mat4.mul(this.projectionViewMatrix, this.projection, this.view);
  }

  public clear() {
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clearColor(0.8, 0.8, 0.8, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}