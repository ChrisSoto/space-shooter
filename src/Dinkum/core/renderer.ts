import vertexShaderSource from "../graphics/shaders/vshader2.glsl?raw";
import fragmentShaderSource from "../graphics/shaders/fshader2.glsl?raw";
// mostly static functions
// set of render command

import { mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Camera } from "../camera/camera";
import { ProgramUtil } from "../graphics/program-util";
import { Resize } from "../util/resize";
import { BufferUtil } from "../graphics/buffer-util";
import { Texture } from "../graphics/sprite/texture";
import { BufferType, RenderLayer } from "./render-layer";

export default class Renderer {
  private canvas: HTMLCanvasElement;
  public gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private resize: Resize;
  private viewProjectionMatLocation: WebGLUniformLocation;
  public data = new Float32Array();
  public positionLocation: number;
  public colorLocation: number;
  public layers: { [name: string]: RenderLayer } = {};
  public camera = {
    x: 0,
    y: 0,
    rotation: 0,
    zoom: 1,
  };

  constructor(public selector: string) {
    this.canvas = document.getElementById(selector) as HTMLCanvasElement;
    this.gl = this.canvas.getContext("webgl2")!;
    // this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.resize = new Resize(this.gl, 1000, 600);
    this.resize.resizeCanvasToDisplaySize();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    const vertexShader = ProgramUtil.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = ProgramUtil.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    this.program = ProgramUtil.createProgram(this.gl, vertexShader, fragmentShader)!;


    this.viewProjectionMatLocation = this.gl.getUniformLocation(this.program, "uProjectionViewMatrix")!;
    this.positionLocation = this.gl.getAttribLocation(this.program, "aPosition");
    this.colorLocation = this.gl.getAttribLocation(this.program, "aColor");

    // const indexBuffer = BufferUtil.createIndexBuffer(this.gl, new Uint8Array([
    //   0, 1, 2,
    //   2, 1, 3,
    // ]));

    // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // const stride = 2 * Float32Array.BYTES_PER_ELEMENT + 3 * Float32Array.BYTES_PER_ELEMENT;

    // this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, stride, 0);
    // this.gl.vertexAttribPointer(this.colorLocation, 3, this.gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

    // this.gl.enableVertexAttribArray(this.positionLocation);
    // this.gl.enableVertexAttribArray(this.colorLocation);

    this.gl.useProgram(this.program);
  }

  public begin() {
    this.gl.clearColor(0.9, 0.9, 0.9, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    const view = mat4.lookAt(mat4.create(), [0, 0, 1], [0, 0, 0], [0, 1, 0])
    const projection = mat4.create();
    mat4.ortho(projection, 0, this.canvas.width, this.canvas.height, 0, -1, 1);
    mat4.translate(projection, projection, [this.camera.x, this.camera.y, 0]);
    mat4.rotateX(projection, projection, 0);
    mat4.rotateY(projection, projection, 0);
    mat4.rotateZ(projection, projection, degToRad(this.camera.rotation));
    mat4.scale(projection, projection, [this.camera.zoom, this.camera.zoom, 0]);
    mat4.invert(projection, projection);
    mat4.mul(projection, projection, view);

    this.gl.uniformMatrix4fv(this.viewProjectionMatLocation, false, projection);
  }

  public end() {
    // this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_BYTE, 0);
  }


  public draw(): void {
    const size = 5;
    for (const name in this.layers) {
      // this.layers[name].drawQuad([0, 0], [size, size], [1, 0, 1, 1]);
      // this.layers[name].drawQuad([this.canvas.width - size, 0], [size, size], [0, 0, 1, 1]);
      // this.layers[name].drawQuad([0, this.canvas.height - size], [size, size], [0, 1, 0, 1]);
      // this.layers[name].drawQuad([this.canvas.width - size, this.canvas.height - size], [size, size], [1, 0, 0, 1]);
      for (let i = 0; i < 100; i++) {
        this.layers[name].drawQuad(
          [Math.random() * this.canvas.width, Math.random() * this.canvas.height],
          [size, size], [Math.random(), Math.random(), Math.random(), 1]);
      }
    }
  }
}

function degToRad(d: number) {
  return d * Math.PI / 180;
}

const renderer = new Renderer("canvas");

renderer.layers['test'] = new RenderLayer(renderer, BufferType.NORMAL);
// renderer.layers['batch'] = new RenderLayer(renderer, BufferType.BATCHED);

const draw = () => {
  renderer.begin();
  renderer.draw();
  renderer.end();

  requestAnimationFrame(draw);
}

draw();

