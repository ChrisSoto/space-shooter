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

export class RenderLayer {
  data!: Float32Array;
  buffer!: WebGLBuffer;
  batchCount: number = 0;
  constructor(public renderer: Renderer, public bufferType?: BufferType,) {
    this.data = this.setBufferData();
    this.setupTest();
  }

  private setBufferData() {
    switch (this.bufferType) {
      case BufferType.NORMAL:
        return new Float32Array(5 * 4);
      case BufferType.BATCHED:
        this.setupBatchedRendering();
        return new Float32Array(5 * 4);
      case BufferType.SHARED:
        return this.renderer.data;
      case BufferType.INSTANCED:
        this.setupInstancedRendering();
        return new Float32Array(5 * 4);
      default:
        this.bufferType = BufferType.NORMAL;
        return new Float32Array(5 * 4);
    }
  }

  public drawQuad(position: vec2 | vec3, size: vec2, color: vec4, _texture?: Texture) {
    this.quadData(position, size, color);
    switch (this.bufferType) {
      case BufferType.NORMAL:
        this.drawQuadNormal();
        break;
      case BufferType.BATCHED:
        // this.drawQuadBatched(quad);
        break;
      case BufferType.SHARED:
        // this.drawQuadShared(quad);
        break;
      case BufferType.INSTANCED:
        // this.drawQuadInstanced(quad);
        break;
      default:
        this.drawQuadNormal();
        break;
    }
  }

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

  private drawQuadNormal() {
    this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, this.buffer);
    this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
    this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, 6, this.renderer.gl.UNSIGNED_BYTE, 0);
  }

  private setupTest() {
    this.buffer = BufferUtil.createArrayBuffer(this.renderer.gl, this.data);

    const indexBuffer = BufferUtil.createIndexBuffer(this.renderer.gl, new Uint8Array([
      0, 1, 2,
      2, 1, 3,
    ]));

    this.renderer.gl.bindBuffer(this.renderer.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const stride = 2 * Float32Array.BYTES_PER_ELEMENT + 3 * Float32Array.BYTES_PER_ELEMENT;

    this.renderer.gl.vertexAttribPointer(this.renderer.positionLocation, 2, this.renderer.gl.FLOAT, false, stride, 0);
    this.renderer.gl.vertexAttribPointer(this.renderer.colorLocation, 3, this.renderer.gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

    this.renderer.gl.enableVertexAttribArray(this.renderer.positionLocation);
    this.renderer.gl.enableVertexAttribArray(this.renderer.colorLocation);
  }

  private drawQuadBatched(data: Float32Array) {
    this.batchCount += 1;
    // access data stored on layer
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