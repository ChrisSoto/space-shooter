import vertexShaderSource from "../graphics/shaders/vshader2.glsl?raw";
import fragmentShaderSource from "../graphics/shaders/fshader2.glsl?raw";
// mostly static functions
// set of render command

import { mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";
import { ProgramUtil } from "../graphics/program-util";
import { Resize } from "../util/resize";
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
  public textureLocation: number;
  public layers: { [name: string]: RenderLayer } = {};
  public testTexture: WebGLTexture;
  public camera = {
    x: 0,
    y: 0,
    rotation: 0,
    zoom: 1,
  };

  private delayedDraws: (Promise<() => void>)[] = [];

  constructor(public selector: string) {
    this.canvas = document.getElementById(selector) as HTMLCanvasElement;
    this.gl = this.canvas.getContext("webgl2")!;
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.resize = new Resize(this.gl, 1000, 600);
    this.resize.resizeCanvasToDisplaySize();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.testTexture = this.loadTexture("assets/uvTexture.png");

    const vertexShader = ProgramUtil.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = ProgramUtil.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    this.program = ProgramUtil.createProgram(this.gl, vertexShader, fragmentShader)!;

    this.viewProjectionMatLocation = this.gl.getUniformLocation(this.program, "uProjectionViewMatrix")!;
    this.positionLocation = this.gl.getAttribLocation(this.program, "aPosition");
    this.colorLocation = this.gl.getAttribLocation(this.program, "aColor");
    this.textureLocation = this.gl.getAttribLocation(this.program, "aTexCoords");

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

  public addToEnd(delayedDraw: Promise<() => void>) {
    this.delayedDraws.push(delayedDraw);
  }

  public end() {
    for (const name in this.layers) {
      if (this.layers[name].bufferType === BufferType.BATCHED) {
        this.layers[name].batchEnd()
      }
    }
  }

  public draw(): void {
    const little = 50;
    const width = this.canvas.width;
    const height = this.canvas.height;
    // get textures working

    for (let i = 0; i < 1000; i++) {
      this.layers['test'].drawQuad(
        [Math.random() * width, Math.random() * height],
        [little, little], [1, 1, 1, 1]);
    }

    // this.layers['test'].drawQuad([this.canvas.width / 2, this.canvas.height / 2], [300, 300], [1, 1, 1, 1]);
    // this.layers['test'].drawQuad([this.canvas.width - size, 0], [size, size], [0, 1, 0, 1]);
    // this.layers['test'].drawQuad([0, this.canvas.height - size], [size, size], [0, 0, 1, 1]);
    // this.layers['test'].drawQuad([this.canvas.width - size, this.canvas.height - size], [size, size], [1, 0, 1, 1]);
  }


  private loadTexture(uri: string): WebGLTexture {
    const texture = this.gl.createTexture()!;
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.texImage2D(this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1, // width
      1, // height
      0, // border
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 255, 255]));

    const image = new Image();
    image.onload = () => {
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        image);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);

    }
    image.src = uri;

    return texture;

  }
}

function degToRad(d: number) {
  return d * Math.PI / 180;
}

const renderer = new Renderer("canvas");

renderer.layers['test'] = new RenderLayer(renderer, BufferType.BATCHED);
// renderer.layers['batch'] = new RenderLayer(renderer, BufferType.BATCHED);

let i = 0;

const draw = () => {
  renderer.begin();
  renderer.draw();
  renderer.end();
  i++;

  requestAnimationFrame(draw);
}

draw();

