import vertexShaderSource from "../shaders/vshader.glsl?raw";
import fragmentShaderSource from "../shaders/fshader.glsl?raw";
import { Camera } from "../../camera/camera";
import { ProgramUtil } from "../program-util";
import { BufferUtil } from "../buffer-util";
import { Texture } from "./texture";
import { Rect } from "../rect";
import { Color } from "../color";
import { vec2 } from "gl-matrix";

const MAX_NUMBER_OF_SPRITES = 1000;
const FLOATS_PER_VERTEX = 7;
const FLOATS_PER_SPRITE = 4 * FLOATS_PER_VERTEX;
const INDEX_PER_SPRITE = 6;

export class SpriteRenderer {

  private instanceCount = 0;
  private currentTexture: Texture | null = null;
  private defaultColor = new Color();

  private program!: WebGLProgram;
  private projectionViewMatrixLocation!: WebGLUniformLocation;
  private modelTransformMatrixLocation!: WebGLUniformLocation;
  private camera!: Camera;
  private buffer!: WebGLBuffer;
  private indexBuffer!: WebGLBuffer;
  private data: Float32Array = new Float32Array(FLOATS_PER_SPRITE * MAX_NUMBER_OF_SPRITES);

  private v0: vec2 = vec2.create();
  private v1: vec2 = vec2.create();
  private v2: vec2 = vec2.create();
  private v3: vec2 = vec2.create();

  private _origin: vec2 = vec2.create();

  constructor(
    private gl: WebGL2RenderingContext,
    private width: number,
    private height: number) { }

  private setupIndexbufferData() {

    const data = new Uint16Array(MAX_NUMBER_OF_SPRITES * INDEX_PER_SPRITE);

    for (let i = 0; i < MAX_NUMBER_OF_SPRITES; i++) {
      // triangle 1
      data[i * INDEX_PER_SPRITE + 0] = i * 4 + 0;
      data[i * INDEX_PER_SPRITE + 1] = i * 4 + 1;
      data[i * INDEX_PER_SPRITE + 2] = i * 4 + 3;
      // triangle 2
      data[i * INDEX_PER_SPRITE + 3] = i * 4 + 1;
      data[i * INDEX_PER_SPRITE + 4] = i * 4 + 2;
      data[i * INDEX_PER_SPRITE + 5] = i * 4 + 3;
    }

    return data;
  }

  public async initialize() {

    this.camera = new Camera(this.width, this.height);

    const vertexShader = ProgramUtil.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = ProgramUtil.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    this.program = ProgramUtil.createProgram(this.gl, vertexShader, fragmentShader)!;
    this.projectionViewMatrixLocation = this.gl.getUniformLocation(this.program, "uProjectionViewMatrix")!;
    this.modelTransformMatrixLocation = this.gl.getUniformLocation(this.program, "uModelTransformMatrix")!;

    //
    // position buffer
    //

    this.buffer = BufferUtil.createArrayBuffer(this.gl, this.data);

    const stride =
      2 * Float32Array.BYTES_PER_ELEMENT +
      2 * Float32Array.BYTES_PER_ELEMENT +
      3 * Float32Array.BYTES_PER_ELEMENT;

    //
    // vertex buffer
    //

    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, stride, 0);
    this.gl.enableVertexAttribArray(0);

    //
    // texture buffer
    //

    this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
    this.gl.enableVertexAttribArray(1)

    //
    // color buffer
    //

    this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
    this.gl.enableVertexAttribArray(2);


    //
    // index buffer
    //

    console.log('create index buffer');
    this.indexBuffer = BufferUtil.createIndexBuffer(this.gl, this.setupIndexbufferData());

    this.camera.update();
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.useProgram(this.program);
    // this.gl.uniformMatrix4fv(this.projectionViewMatrixLocation, false, this.camera.projectionViewMatrix);
  }

  private setTexture(texture: Texture) {
    if (this.currentTexture != texture) {
      this.end();
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture);
      this.currentTexture = texture;
    }
  }

  private setRectCoords(rect: Rect) {
    this.v0[0] = rect.x;
    this.v0[1] = rect.y;
    this.v1[0] = rect.x + rect.width;
    this.v1[1] = rect.y;
    this.v2[0] = rect.x + rect.width;
    this.v2[1] = rect.y + rect.height;
    this.v3[0] = rect.x;
    this.v3[1] = rect.y + rect.height;
  }

  setRotation(rotation: number, rect: Rect, origin: vec2 | null) {
    if (rotation != 0) {
      this._origin[0] = rect.x;
      this._origin[1] = rect.y;

      if (origin != null) {
        this._origin[0] += rect.width * origin[0];
        this._origin[1] += rect.height * origin[1];
      }

      vec2.rotate(this.v0, this.v0, this._origin, rotation);
      vec2.rotate(this.v1, this.v1, this._origin, rotation);
      vec2.rotate(this.v2, this.v2, this._origin, rotation);
      vec2.rotate(this.v3, this.v3, this._origin, rotation);
    }
  }

  public drawSprite(
    texture: Texture,
    rect: Rect,
    sourceRect?: Rect,
    color: Color = this.defaultColor,
    rotation: number = 0,
    origin: vec2 | null = null) {

    this.setTexture(texture);
    this.setRectCoords(rect);
    this.setRotation(rotation, rect, origin);

    // setup uv coordinates
    let u0: number = 0, v0 = 1, u1 = 1, v1 = 0;

    if (sourceRect) {
      u0 = sourceRect.x / texture.width;
      v0 = 1 - sourceRect.y / texture.height;
      u1 = (sourceRect.x + sourceRect.width) / texture.width;
      v1 = 1 - (sourceRect.y + sourceRect.height) / texture.height;
    }

    let i = this.instanceCount * FLOATS_PER_SPRITE;

    // top left 
    this.data[0 + i] = this.v0[0]; // x 
    this.data[1 + i] = this.v0[1]; // y 
    this.data[2 + i] = u0;      // u
    this.data[3 + i] = v0;      // v
    this.data[4 + i] = color.r;      // r
    this.data[5 + i] = color.g;      // g
    this.data[6 + i] = color.b;      // b

    // top right
    this.data[7 + i] = this.v1[0]; // x 
    this.data[8 + i] = this.v1[1]; // x      // y
    this.data[9 + i] = u1;                   // u
    this.data[10 + i] = v0;                  // v
    this.data[11 + i] = color.r;                  // r
    this.data[12 + i] = color.g;                  // g
    this.data[13 + i] = color.b;                  // b

    // bottom right
    this.data[14 + i] = this.v2[0]; // x 
    this.data[15 + i] = this.v2[1]; // x 
    this.data[16 + i] = u1;                   // u
    this.data[17 + i] = v1;                   // v
    this.data[18 + i] = color.r;                   // r
    this.data[19 + i] = color.g;                   // g
    this.data[20 + i] = color.b;                   // b

    // bottom left
    this.data[21 + i] = this.v3[0]; // x 
    this.data[22 + i] = this.v3[1]; // x 
    this.data[23 + i] = u0;                   // u
    this.data[24 + i] = v1;                   // v
    this.data[25 + i] = color.r;                   // r
    this.data[26 + i] = color.g;                   // g
    this.data[27 + i] = color.b;                   // b

    this.instanceCount++;

    //console.log('instance count', this.instanceCount)

    if (this.instanceCount >= MAX_NUMBER_OF_SPRITES) {
      this.end();
    }
  }

  public begin() {
    // this.instanceCount = 0;
    // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.uniformMatrix4fv(this.projectionViewMatrixLocation, false, this.camera.projectionViewMatrix);
  }

  public end() {
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.data);
    this.gl.drawElements(this.gl.TRIANGLES, INDEX_PER_SPRITE * this.instanceCount, this.gl.UNSIGNED_SHORT, 0);
    this.instanceCount = 0;
  }
}