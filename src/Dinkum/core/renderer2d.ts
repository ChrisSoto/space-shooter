import vertexShaderSource from "../graphics/shaders/vshader2.glsl?raw";
import fragmentShaderSource from "../graphics/shaders/fshader2.glsl?raw";
// mostly static functions
// set of render command

import { ProgramUtil } from "../graphics/program-util";
import { BufferType } from "./render-layer";
import { Camera3 } from "../camera/camera3";
import { RenderLayer2D } from "./render-layer2d";
import { Texture } from "../graphics/sprite/texture";

export default class Renderer2D {
  private program: WebGLProgram;
  private viewProjectionMatLocation: WebGLUniformLocation;
  public data = new Float32Array();
  public positionLocation: number;
  public colorLocation: number;
  public textureLocation: number;
  public layers: { [name: string]: RenderLayer2D } = {};
  public testTexture!: Texture;

  constructor(public gl: WebGL2RenderingContext, public camera: Camera3) {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    const vertexShader = ProgramUtil.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = ProgramUtil.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    this.program = ProgramUtil.createProgram(this.gl, vertexShader, fragmentShader)!;

    this.viewProjectionMatLocation = this.gl.getUniformLocation(this.program, "uProjectionViewMatrix")!;
    this.positionLocation = this.gl.getAttribLocation(this.program, "aPosition");
    this.colorLocation = this.gl.getAttribLocation(this.program, "aColor");
    this.textureLocation = this.gl.getAttribLocation(this.program, "aTexCoords");

    this.gl.useProgram(this.program);
  }

  public async initialize() {
    this.testTexture = await Texture.loadTexture(this.gl, "assets/uvTexture.png");
  }

  public begin() {
    const projection = this.camera.updateProjectionView();
    this.gl.uniformMatrix4fv(this.viewProjectionMatLocation, false, projection);
  }

  public end() {
    for (const name in this.layers) {
      if (this.layers[name].bufferType === BufferType.BATCHED) {
        this.layers[name].batchEnd()
      }
    }
  }

  public draw(): void {
    // const little = 50;
    // const width = this.camera.width;
    // const height = this.camera.height;
    // get textures working

    // for (let i = 0; i < 1000; i++) {
    //   this.layers['test'].drawQuad(
    //     [Math.random() * width, Math.random() * height],
    //     [little, little], [1, 1, 1, 1]);
    // }

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

// const renderer = new Renderer2D("canvas");

// renderer.layers['test'] = new RenderLayer(renderer, BufferType.BATCHED);
// // renderer.layers['batch'] = new RenderLayer(renderer, BufferType.BATCHED);

// let i = 0;

// const draw = () => {
//   renderer.begin();
//   renderer.draw();
//   renderer.end();
//   i++;

//   requestAnimationFrame(draw);
// }

// draw();

