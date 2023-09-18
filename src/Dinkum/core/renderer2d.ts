import vertexShaderSource from "../graphics/shaders/vshader2.glsl?raw";
import fragmentShaderSource from "../graphics/shaders/fshader2.glsl?raw";
// setup program from shaders

import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Texture } from "../graphics/sprite/texture";
import { ProgramUtil } from "../graphics/program-util";
import { Camera } from "../camera/camera";
import { BufferUtil } from "../graphics/buffer-util";
import { RenderLayer } from "./render-layer";

export class Renderer2D {
  private program: WebGLProgram;
  private positionLocation: number;
  private colorLocation: number;
  private matrixLocation: WebGLUniformLocation;
  private data: Float32Array = new Float32Array(7 * 4);
  public layers: { [name: string]: RenderLayer } = {};

  constructor(private gl: WebGL2RenderingContext) {
    // setup program
    const vertexShader = ProgramUtil.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = ProgramUtil.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    this.program = ProgramUtil.createProgram(this.gl, vertexShader, fragmentShader)!;
    this.gl.useProgram(this.program);
    // get shader locations
    this.positionLocation = gl.getAttribLocation(this.program, 'aPosition')!;
    this.colorLocation = gl.getAttribLocation(this.program, 'aColor')!;
    this.matrixLocation = gl.getUniformLocation(this.program, 'uMatrix')!;
  }

  public init() {
    // setup vertexArray
    // setup flat color shader
  }
  public shutDown() {
    // destroy vertex arrays
  }

  public begin(camera: Camera) {
    // this.gl.clearColor(0.9, 0.9, 0.9, 1);
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // const view = mat4.lookAt(mat4.create(), [0, 0, 1], [0, 0, 0], [0, 1, 0])
    // // var matrix = mat4.ortho(mat4.create(), 0, this.canvas.clientWidth, this.canvas.clientHeight, 0, -10, 10);
    // const projection = mat4.create();
    // mat4.ortho(projection, 0, this.canvas.clientWidth, this.canvas.clientHeight, 0, -1, 1);
    // mat4.translate(projection, projection, [this.camera.x, this.camera.y, 0]);
    // mat4.rotateX(projection, projection, 0);
    // mat4.rotateY(projection, projection, 0);
    // mat4.rotateZ(projection, projection, degToRad(this.camera.rotation));
    // mat4.scale(projection, projection, [this.camera.zoom, this.camera.zoom, 1]);
    // // mat4.invert(projection, projection);
    // mat4.mul(projection, projection, view);

    // this.gl.uniformMatrix4fv(this.viewProjectionMatLocation, false, projection);

  }

  public draw() {
    for (const name in this.layers) {
      this.layers[name].drawQuad([100, 200], [10, 10], [0, 0, 1, 1]);;
    }
  }

  public end() { }
}