import { vec4 } from "gl-matrix";
import { BufferUtil } from "../graphics/buffer-util";
import Renderer2D from "./renderer2d";
import { Rect } from "../graphics/rect";
import { Sprite } from "../graphics/sprite/sprite";

export enum BufferType {
  NORMAL = 'NORMAL',
  SHARED = 'SHARED',
  BATCHED = 'BATCHED',
  INSTANCED = 'INSTANCED',
}

export class RenderLayer2D {
  private data!: Float32Array;
  private buffer!: WebGLBuffer;
  private batchCount: number = 0;
  // constants
  private FLOATS_PER_VERTEX = 7; // pos (x, y), color (r, g, b)
  private FLOATS_PER_SPRITE = 4 * this.FLOATS_PER_VERTEX; // I think there are 4 bytes per sprite vertex
  private INDICES_PER_SPRITE = 6; // two triangles
  private totalSprites = 100;
  constructor(private renderer: Renderer2D, public bufferType?: BufferType,) {
    this.setBufferType();

    // setting the renderer buffer, the last buffer that can fire
    // this.buffer = this.renderer.setBuffer(this.data);
  }

  private setBufferType() {
    switch (this.bufferType) {
      case BufferType.NORMAL:
        this.data = new Float32Array(this.FLOATS_PER_SPRITE);
        this.setLayerBuffers();
        this.drawQuad = this.drawQuadNormal
        this.drawSprite = this.drawSpriteNormal
        break;
      case BufferType.BATCHED:
        this.data = new Float32Array((this.FLOATS_PER_SPRITE) * this.totalSprites);
        this.setLayerBuffers();
        this.drawQuad = this.drawQuadBatched
        this.drawSprite = this.drawSpriteBatched
        break;
      case BufferType.SHARED:
        // shared with who?
        // this.renderer.data;
        break;
      case BufferType.INSTANCED:
        this.data = new Float32Array(this.FLOATS_PER_SPRITE);
        this.setupInstancedRendering();
        break;
      default:
        this.bufferType = BufferType.NORMAL;
        this.setBufferType();
        break;
    }
  }

  private setSprite(texture: WebGLTexture) {
    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, texture);
  }

  public drawQuad = (_rect: Rect, _color: vec4) => { }
  public drawSprite = (_rect: Rect, _color: vec4, _sprite: Sprite) => { }

  private quadDataNormal(rect: Rect, color: vec4) {
    // bottom left
    this.data[0] = rect.x; // x
    this.data[1] = rect.y + rect.height; // y
    this.data[2] = 0; // u
    this.data[3] = 0; // v
    this.data[4] = color[0]; // r
    this.data[5] = color[1]; // g
    this.data[6] = color[2]; // b

    // top left
    this.data[7] = rect.x; // x
    this.data[8] = rect.y; // y
    this.data[9] = 0; // u
    this.data[10] = 1; // v
    this.data[11] = color[0]; // r
    this.data[12] = color[1]; // g
    this.data[13] = color[2]; // b

    // bottom right
    this.data[14] = rect.x + rect.width; // x
    this.data[15] = rect.y + rect.height; // y
    this.data[16] = 1 // u
    this.data[17] = 0 // v
    this.data[18] = color[0]; // r
    this.data[19] = color[1]; // g
    this.data[20] = color[2]; // b

    // top right
    this.data[21] = rect.x + rect.width; // x
    this.data[22] = rect.y; // y
    this.data[23] = 1; // u
    this.data[24] = 1; // v
    this.data[25] = color[0]; // r
    this.data[26] = color[1]; // g
    this.data[27] = color[2]; // b
  }

  private quadDataBatched(rect: Rect, color: vec4) {
    let i = this.batchCount * this.FLOATS_PER_SPRITE;
    // bottom left
    this.data[0 + i] = rect.x; // x
    this.data[1 + i] = rect.y + rect.height; // y
    this.data[2 + i] = 0; // u
    this.data[3 + i] = 0; // v
    this.data[4 + i] = color[0]; // r
    this.data[5 + i] = color[1]; // g
    this.data[6 + i] = color[2]; // b

    // top left
    this.data[7 + i] = rect.x; // x
    this.data[8 + i] = rect.y; // y
    this.data[9 + i] = 0; // u
    this.data[10 + i] = 1; // v
    this.data[11 + i] = color[0]; // r
    this.data[12 + i] = color[1]; // g
    this.data[13 + i] = color[2]; // b

    // bottom right
    this.data[14 + i] = rect.x + rect.width; // x
    this.data[15 + i] = rect.y + rect.height; // y
    this.data[16 + i] = 1 // u
    this.data[17 + i] = 0 // v
    this.data[18 + i] = color[0]; // r
    this.data[19 + i] = color[1]; // g
    this.data[20 + i] = color[2]; // b

    // top right
    this.data[21 + i] = rect.x + rect.width; // x
    this.data[22 + i] = rect.y; // y
    this.data[23 + i] = 1; // u
    this.data[24 + i] = 1; // v
    this.data[25 + i] = color[0]; // r
    this.data[26 + i] = color[1]; // g
    this.data[27 + i] = color[2]; // b
  }

  private spriteDataNormal(rect: Rect, color: vec4, sprite: Sprite) {
    this.setSprite(sprite.texture.texture)

    const u0 = sprite.sourceRect.x / sprite.texture.width;
    const v0 = 1 - (sprite.sourceRect.y / sprite.texture.height);

    const u1 = (sprite.sourceRect.x + sprite.sourceRect.width) / sprite.texture.width;
    const v1 = 1 - (sprite.sourceRect.y + sprite.sourceRect.height) / sprite.texture.height;

    // bottom left
    this.data[0] = rect.x; // x
    this.data[1] = rect.y + rect.height; // y
    this.data[2] = u1; // u
    this.data[3] = v1; // v
    this.data[4] = color[0]; // r
    this.data[5] = color[1]; // g
    this.data[6] = color[2]; // b

    // top left
    this.data[7] = rect.x; // x
    this.data[8] = rect.y; // y
    this.data[9] = u1; // u
    this.data[10] = v0; // v
    this.data[11] = color[0]; // r
    this.data[12] = color[1]; // g
    this.data[13] = color[2]; // b

    // bottom right
    this.data[14] = rect.x + rect.width; // x
    this.data[15] = rect.y + rect.height; // y
    this.data[16] = u0 // u
    this.data[17] = v1 // v
    this.data[18] = color[0]; // r
    this.data[19] = color[1]; // g
    this.data[20] = color[2]; // b

    // top right
    this.data[21] = rect.x + rect.width; // x
    this.data[22] = rect.y; // y
    this.data[23] = u0; // u
    this.data[24] = v0; // v
    this.data[25] = color[0]; // r
    this.data[26] = color[1]; // g
    this.data[27] = color[2]; // b
  }

  private spriteDataBatched(rect: Rect, color: vec4, sprite: Sprite) {
    this.setSprite(sprite.texture.texture)
    let i = this.batchCount * this.FLOATS_PER_SPRITE;
    // bottom left
    this.data[0 + i] = rect.x; // x
    this.data[1 + i] = rect.y + rect.height; // y
    this.data[2 + i] = 0; // u
    this.data[3 + i] = 0; // v
    this.data[4 + i] = color[0]; // r
    this.data[5 + i] = color[1]; // g
    this.data[6 + i] = color[2]; // b

    // top left
    this.data[7 + i] = rect.x; // x
    this.data[8 + i] = rect.y; // y
    this.data[9 + i] = 0; // u
    this.data[10 + i] = 1; // v
    this.data[11 + i] = color[0]; // r
    this.data[12 + i] = color[1]; // g
    this.data[13 + i] = color[2]; // b

    // bottom right
    this.data[14 + i] = rect.x + rect.width; // x
    this.data[15 + i] = rect.y + rect.height; // y
    this.data[16 + i] = 1 // u
    this.data[17 + i] = 0 // v
    this.data[18 + i] = color[0]; // r
    this.data[19 + i] = color[1]; // g
    this.data[20 + i] = color[2]; // b

    // top right
    this.data[21 + i] = rect.x + rect.width; // x
    this.data[22 + i] = rect.y; // y
    this.data[23 + i] = 1; // u
    this.data[24 + i] = 1; // v
    this.data[25 + i] = color[0]; // r
    this.data[26 + i] = color[1]; // g
    this.data[27 + i] = color[2]; // b
  }

  private setLayerBuffers() {
    this.setBuffer();
    this.setVertexAttribPointers();
    this.renderer.gl.enableVertexAttribArray(this.renderer.positionLocation);
    this.renderer.gl.enableVertexAttribArray(this.renderer.colorLocation);
    this.renderer.gl.enableVertexAttribArray(this.renderer.textureLocation);
  }

  private setVertexAttribPointers() {
    const stride = 2 * Float32Array.BYTES_PER_ELEMENT + 2 * Float32Array.BYTES_PER_ELEMENT + 3 * Float32Array.BYTES_PER_ELEMENT;
    this.renderer.gl.vertexAttribPointer(this.renderer.positionLocation, 2, this.renderer.gl.FLOAT, false, stride, 0);
    this.renderer.gl.vertexAttribPointer(this.renderer.colorLocation, 3, this.renderer.gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
    this.renderer.gl.vertexAttribPointer(this.renderer.textureLocation, 2, this.renderer.gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT)
  }

  private setBuffer() {
    this.buffer = BufferUtil.createArrayBuffer(this.renderer.gl, this.data);
    this.setBatchedIndexBufferData();
    this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, this.buffer);
  }

  private setBatchedIndexBufferData() {

    const data = new Uint16Array(this.totalSprites * this.INDICES_PER_SPRITE);

    for (let i = 0; i < this.totalSprites; i++) {
      // t1
      data[i * this.INDICES_PER_SPRITE + 0] = i * 4 + 0;
      data[i * this.INDICES_PER_SPRITE + 1] = i * 4 + 1;
      data[i * this.INDICES_PER_SPRITE + 2] = i * 4 + 2;

      // t2
      data[i * this.INDICES_PER_SPRITE + 3] = i * 4 + 2;
      data[i * this.INDICES_PER_SPRITE + 4] = i * 4 + 1;
      data[i * this.INDICES_PER_SPRITE + 5] = i * 4 + 3;
    }

    const buffer = BufferUtil.createIndexBuffer(this.renderer.gl, new Uint16Array(data));
    this.renderer.gl.bindBuffer(this.renderer.gl.ELEMENT_ARRAY_BUFFER, buffer);
  }

  private drawQuadNormal(rect: Rect, color: vec4) {
    this.quadDataNormal(rect, color);
    this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
    this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, this.INDICES_PER_SPRITE, this.renderer.gl.UNSIGNED_SHORT, 0);
  }

  private drawQuadBatched(rect: Rect, color: vec4) {
    this.quadDataBatched(rect, color);
    this.batchCount++;
  }

  private drawSpriteNormal(rect: Rect, color: vec4, sprite: Sprite) {
    this.spriteDataNormal(rect, color, sprite);
    this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
    this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, this.INDICES_PER_SPRITE, this.renderer.gl.UNSIGNED_SHORT, 0);
  }

  private drawSpriteBatched(rect: Rect, color: vec4, sprite: Sprite) {
    this.spriteDataBatched(rect, color, sprite);
    this.batchCount++;
  }

  public batchEnd() {
    const batch = BufferUtil.resizeBuffer(this.totalSprites, this.batchCount);

    this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
    this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, this.INDICES_PER_SPRITE * batch.count, this.renderer.gl.UNSIGNED_SHORT, 0);

    // if batchCount is within 90% of the size of of maxSprites
    // increase the number of maxSprites by 15%
    if (batch.tooBig) {
      this.totalSprites = Math.round(this.batchCount * 1.15);

      this.data = new Float32Array(this.FLOATS_PER_SPRITE * this.totalSprites);
      this.setBuffer();
      this.setVertexAttribPointers();
    }

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

  // private async drawQuadBatchedPromise(): Promise<() => void> {
  //   return new Promise((resolve, reject) => {
  //     resolve(() => {
  //       const batch = BufferUtil.resizeBuffer(this.totalSprites, this.batchCount);

  //       this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
  //       this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, this.INDICES_PER_SPRITE * batch.count, this.renderer.gl.UNSIGNED_SHORT, 0);

  //       // if batchCount is within 90% of the size of of maxSprites
  //       // increase the number of maxSprites by 15%
  //       if (batch.tooBig) {
  //         this.totalSprites = Math.round(this.batchCount * 1.15);

  //         this.data = new Float32Array(this.FLOATS_PER_SPRITE * this.totalSprites);
  //         this.setBuffer();
  //         const stride = 2 * Float32Array.BYTES_PER_ELEMENT + 3 * Float32Array.BYTES_PER_ELEMENT;
  //         this.renderer.gl.vertexAttribPointer(this.renderer.positionLocation, 2, this.renderer.gl.FLOAT, false, stride, 0);
  //         this.renderer.gl.vertexAttribPointer(this.renderer.colorLocation, 3, this.renderer.gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
  //       }

  //       this.batchCount = 0;
  //     });
  //   });
  // }
}