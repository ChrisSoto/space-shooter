import vertexShaderSource from "../graphics/shaders/vshader2.glsl?raw";
import fragmentShaderSource from "../graphics/shaders/fshader2.glsl?raw";
// mostly static functions
// set of render command

import { ProgramUtil } from "../graphics/program-util";
import { Camera3 } from "../camera/camera";
import { BufferType, RenderLayer } from "./render-layer";
import { Texture } from "../graphics/sprite/texture";

export default class Renderer {
  public program: WebGLProgram;
  private projectionViewMatrixLocation: WebGLUniformLocation;
  public data = new Float32Array();
  public positionLocation: number;
  public colorLocation: number;
  public textureLocation: number;
  public layers: { [name: string]: RenderLayer } = {};
  public testTexture!: Texture;
  public whiteTexture!: Texture;

  constructor(public gl: WebGL2RenderingContext, public camera: Camera3) {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    const vertexShader = ProgramUtil.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = ProgramUtil.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    this.program = ProgramUtil.createProgram(this.gl, vertexShader, fragmentShader)!;

    this.projectionViewMatrixLocation = this.gl.getUniformLocation(this.program, "uProjectionViewMatrix")!;
    this.positionLocation = this.gl.getAttribLocation(this.program, "aPosition");
    this.colorLocation = this.gl.getAttribLocation(this.program, "aColor");
    this.textureLocation = this.gl.getAttribLocation(this.program, "aTexCoords");

    this.gl.useProgram(this.program);
  }

  public async initialize() {
    this.testTexture = await Texture.loadTexture(this.gl, "assets/uvTexture.png");
    this.whiteTexture = await Texture.loadTexture(this.gl, "assets/whiteTexture.png");
  }

  public begin() {
    this.gl.uniformMatrix4fv(this.projectionViewMatrixLocation, false, this.camera.projectionViewMatrix);
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

