import { vec2, vec3, vec4 } from "gl-matrix";
import { Texture } from "../graphics/sprite/texture";
import Renderer from "./renderer";
import { BufferUtil } from "../graphics/buffer-util";

export enum BufferType {
  NORMAL = 'NORMAL',
  SHARED = 'SHARED',
  BATCHED = 'BATCHED',
  INSTANCED = 'INSTANCED',
}

const MAX_SPRITES = 3000;
const INDICES_PER_SPRITE = 6;

export class RenderLayer {
  data!: Float32Array;
  buffer!: WebGLBuffer;
  batchCount: number = 0;
  constructor(public renderer: Renderer, public bufferType?: BufferType,) {
    this.setBufferType();

    // setting the renderer buffer, the last buffer that can fire
    // this.buffer = this.renderer.setBuffer(this.data);
  }

  private setBufferType() {
    switch (this.bufferType) {
      case BufferType.NORMAL:
        this.data = new Float32Array(5 * 4);
        this.setNormalLayerBuffers();
        this.drawQuad = this.drawQuadNormal
        break;
      case BufferType.BATCHED:
        this.data = new Float32Array(5 * 4);
        this.setBatchedLayerBuffers();
        this.drawQuad = this.drawQuadBatched
        break;
      case BufferType.SHARED:
        // shared with who?
        // this.renderer.data;
        break;
      case BufferType.INSTANCED:
        this.setupInstancedRendering();
        this.data = new Float32Array(5 * 4);
        break;
      default:
        this.bufferType = BufferType.NORMAL;
        this.setBufferType();
        break;
    }
  }

  public drawQuad = (_position: vec2 | vec3, _size: vec2, _color: vec4, _texture?: Texture) => { }

  // public drawQuad(position: vec2 | vec3, size: vec2, color: vec4, _texture?: Texture) {
  //   this.quadData(position, size, color);
  //   switch (this.bufferType) {
  //     case BufferType.NORMAL:
  //       this.drawQuadNormal();
  //       break;
  //     case BufferType.BATCHED:
  //       // this.drawQuadBatched(quad);
  //       break;
  //     case BufferType.SHARED:
  //       // this.drawQuadShared(quad);
  //       break;
  //     case BufferType.INSTANCED:
  //       // this.drawQuadInstanced(quad);
  //       break;
  //     default:
  //       this.drawQuadNormal();
  //       break;
  //   }
  // }

  private quadData(position: vec2 | vec3, size: vec2, color: vec4, _texture?: Texture) {
    // top left
    this.data[0] = position[0]; // x
    this.data[1] = position[1] + size[1]; // y
    this.data[2] = color[0]; // r
    this.data[3] = color[1]; // g
    this.data[4] = color[2]; // b

    // top right
    this.data[5] = position[0] + size[0]; // x
    this.data[6] = position[1] + size[1]; // y
    this.data[7] = color[0]; // r
    this.data[8] = color[1]; // g
    this.data[9] = color[2]; // b

    // bottom right
    this.data[10] = position[0]; // x
    this.data[11] = position[1]; // y
    this.data[12] = color[0]; // r
    this.data[13] = color[1]; // g
    this.data[14] = color[2]; // b

    // bottom left
    this.data[15] = position[0] + size[0]; // x
    this.data[16] = position[1]; // y
    this.data[17] = color[0]; // r
    this.data[18] = color[1]; // g
    this.data[19] = color[2]; // b
  }

  private setBatchedLayerBuffers() {
    this.buffer = BufferUtil.createArrayBuffer(this.renderer.gl, this.data);

    this.setBatchedIndexBufferData();

    const stride = 2 * Float32Array.BYTES_PER_ELEMENT + 3 * Float32Array.BYTES_PER_ELEMENT;

    this.renderer.gl.vertexAttribPointer(this.renderer.positionLocation, 2, this.renderer.gl.FLOAT, false, stride, 0);
    this.renderer.gl.vertexAttribPointer(this.renderer.colorLocation, 3, this.renderer.gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

    this.renderer.gl.enableVertexAttribArray(this.renderer.positionLocation);
    this.renderer.gl.enableVertexAttribArray(this.renderer.colorLocation);

    this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, this.buffer);
  }

  private setBatchedIndexBufferData() {

    const data = new Uint16Array(MAX_SPRITES * INDICES_PER_SPRITE);

    for (let i = 0; i < MAX_SPRITES; i++) {
      // t1
      data[i * INDICES_PER_SPRITE + 0] = i * 4 + 0;
      data[i * INDICES_PER_SPRITE + 1] = i * 4 + 1;
      data[i * INDICES_PER_SPRITE + 2] = i * 4 + 2;

      // t2
      data[i * INDICES_PER_SPRITE + 3] = i * 4 + 2;
      data[i * INDICES_PER_SPRITE + 4] = i * 4 + 1;
      data[i * INDICES_PER_SPRITE + 5] = i * 4 + 3;
    }

    const buffer = BufferUtil.createIndexBuffer(this.renderer.gl, new Uint16Array(data));
    this.renderer.gl.bindBuffer(this.renderer.gl.ELEMENT_ARRAY_BUFFER, buffer);
  }

  private setNormalLayerBuffers() {
    this.buffer = BufferUtil.createArrayBuffer(this.renderer.gl, this.data);

    this.setBatchedIndexBufferData();

    const stride = 2 * Float32Array.BYTES_PER_ELEMENT + 3 * Float32Array.BYTES_PER_ELEMENT;

    this.renderer.gl.vertexAttribPointer(this.renderer.positionLocation, 2, this.renderer.gl.FLOAT, false, stride, 0);
    this.renderer.gl.vertexAttribPointer(this.renderer.colorLocation, 3, this.renderer.gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

    this.renderer.gl.enableVertexAttribArray(this.renderer.positionLocation);
    this.renderer.gl.enableVertexAttribArray(this.renderer.colorLocation);

    this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, this.buffer);
  }

  private drawQuadNormal(position: vec2 | vec3, size: vec2, color: vec4, _texture?: Texture) {
    this.quadData(position, size, color);
    this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
    this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, 6, this.renderer.gl.UNSIGNED_SHORT, 0);
  }

  // this has to be defferred till renderer.end()
  private drawQuadBatched(position: vec2 | vec3, size: vec2, color: vec4, _texture?: Texture) {
    // access data stored on layer
    this.quadData(position, size, color);
    this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
    this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, 6 * this.batchCount, this.renderer.gl.UNSIGNED_SHORT, 0);
    this.batchCount = 0;
  }

  private drawQuadShared(data: Float32Array) {
    // access data stored in renderer

  }

  private drawQuadInstanced(data: Float32Array) {
    // not sure

  }

  private setupBatchedRendering() {

  }

  private setupInstancedRendering() {

  }
}