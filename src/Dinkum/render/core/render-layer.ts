import { mat3, vec2 } from "gl-matrix";
import { BufferUtil } from "../graphics/buffer-util";
import Renderer2D from "./renderer";
import { Rect } from "../graphics/rect";
import { Sprite } from "../graphics/sprite/sprite";
import { Texture } from "../graphics/sprite/texture";
import { Color } from "../graphics/color";

export enum BufferType {
  NORMAL = 'NORMAL',
  SHARED = 'SHARED',
  BATCHED = 'BATCHED',
  INSTANCED = 'INSTANCED',
}

export class RenderLayer {
  private data!: Float32Array;
  private buffer!: WebGLBuffer;
  private batchCount: number = 0;
  private origin: vec2 = vec2.create();
  // constants
  private FLOATS_PER_VERTEX = 7; // pos (x, y), color (r, g, b)
  private FLOATS_PER_SPRITE = 4 * this.FLOATS_PER_VERTEX; // I think there are 4 bytes per sprite vertex
  private INDICES_PER_SPRITE = 6; // two triangles
  private totalQuads = 1000;

  private v0: vec2 = vec2.create();
  private v1: vec2 = vec2.create();
  private v2: vec2 = vec2.create();
  private v3: vec2 = vec2.create();
  constructor(private renderer: Renderer2D, public bufferType?: BufferType,) {
    this.setBufferType();
    // this.modelTransformMatrixLocation = this.renderer.gl.getUniformLocation(this.renderer.program, "uProjectionViewMatrix")!;

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
        this.data = new Float32Array((this.FLOATS_PER_SPRITE) * this.totalQuads);
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

  private setSprite(texture: Texture) {
    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, texture.texture);
  }

  public drawQuad = (_rect: Rect, _color: Color) => { }
  public drawSprite = (_rect: Rect, _color: Color, _sprite: Sprite) => { }

  private setRectToVertex(rect: Rect) {

    this.v0[0] = rect.x; // x //d
    this.v0[1] = rect.y + rect.height; // y // d
    this.v1[0] = rect.x; // x // a
    this.v1[1] = rect.y; // y // a
    this.v2[0] = rect.x + rect.width; // x // c
    this.v2[1] = rect.y + rect.height; // y // c
    this.v3[0] = rect.x + rect.width; // x // b
    this.v3[1] = rect.y; // y // b

    if (rect.angle > 0) {
      this.origin[0] = rect.x;
      this.origin[1] = rect.y;

      if (rect.origin[0] > 0 || rect.origin[1] > 0) {

        this.origin[0] += rect.width * rect.origin[0];
        this.origin[1] += rect.height * rect.origin[1];
      }

      vec2.rotate(this.v0, this.v0, this.origin, rect.angle);
      vec2.rotate(this.v1, this.v1, this.origin, rect.angle);
      vec2.rotate(this.v2, this.v2, this.origin, rect.angle);
      vec2.rotate(this.v3, this.v3, this.origin, rect.angle);

      this.v0[0] += rect.x - this.origin[0];
      this.v0[1] += rect.y - this.origin[1];
      this.v1[0] += rect.x - this.origin[0];
      this.v1[1] += rect.y - this.origin[1];
      this.v2[0] += rect.x - this.origin[0];
      this.v2[1] += rect.y - this.origin[1];
      this.v3[0] += rect.x - this.origin[0];
      this.v3[1] += rect.y - this.origin[1];

    }
  }

  private quadDataNormal(rect: Rect, color: Color) {

    this.setRectToVertex(rect);

    // bottom left
    this.data[0] = this.v0[0] // x
    this.data[1] = this.v0[1] // y
    this.data[2] = 0; // u
    this.data[3] = 0; // v
    this.data[4] = color.r; // r
    this.data[5] = color.g; // g
    this.data[6] = color.b; // b

    // top left
    this.data[7] = this.v1[0] // x
    this.data[8] = this.v1[1] // y
    this.data[9] = 0; // u
    this.data[10] = 1; // v
    this.data[11] = color.r; // r
    this.data[12] = color.g; // g
    this.data[13] = color.b; // b

    // bottom right
    this.data[14] = this.v2[0] // y
    this.data[15] = this.v2[1] // y
    this.data[16] = 1 // u
    this.data[17] = 0 // v
    this.data[18] = color.r; // r
    this.data[19] = color.g; // g
    this.data[20] = color.b; // b

    // top right
    this.data[21] = this.v3[0] // y
    this.data[22] = this.v3[1] // y
    this.data[23] = 1; // u
    this.data[24] = 1; // v
    this.data[25] = color.r; // r
    this.data[26] = color.g; // g
    this.data[27] = color.b; // b


  }

  public drawLine(start: vec2, stop: vec2, lineWidth: number, color: Color) {
    // could probably do some sort of check to skip calculating angle
    const length = vec2.distance(start, stop);
    const angle = Math.atan2(stop[1] - start[1], stop[0] - start[0])
    const rect = new Rect(start[0], start[1], 0, length, lineWidth);
    rect.angle = angle;
    rect.origin = [0, 0.5]
    this.drawQuadNormal(rect, color);
  }

  private quadDataBatched(rect: Rect, color: Color) {
    let i = this.batchCount * this.FLOATS_PER_SPRITE;

    // bottom left
    this.data[0 + i] = rect.x; // x
    this.data[1 + i] = rect.y + rect.height; // y
    this.data[2 + i] = 0; // u
    this.data[3 + i] = 0; // v
    this.data[4 + i] = color.r; // r
    this.data[5 + i] = color.g; // g
    this.data[6 + i] = color.b; // b

    // top left
    this.data[7 + i] = rect.x; // x
    this.data[8 + i] = rect.y; // y
    this.data[9 + i] = 0; // u
    this.data[10 + i] = 1; // v
    this.data[11 + i] = color.r; // r
    this.data[12 + i] = color.g; // g
    this.data[13 + i] = color.b; // b

    // bottom right
    this.data[14 + i] = rect.x + rect.width; // x
    this.data[15 + i] = rect.y + rect.height; // y
    this.data[16 + i] = 1 // u
    this.data[17 + i] = 0 // v
    this.data[18 + i] = color.r; // r
    this.data[19 + i] = color.g; // g
    this.data[20 + i] = color.b; // b

    // top right
    this.data[21 + i] = rect.x + rect.width; // x
    this.data[22 + i] = rect.y; // y
    this.data[23 + i] = 1; // u
    this.data[24 + i] = 1; // v
    this.data[25 + i] = color.r; // r
    this.data[26 + i] = color.g; // g
    this.data[27 + i] = color.b; // b
  }

  private spriteDataNormal(rect: Rect, color: Color, sprite: Sprite) {
    this.setSprite(sprite.texture)

    const u0 = sprite.sourceRect.x / sprite.texture.width;
    const v0 = 1 - (sprite.sourceRect.y / sprite.texture.height);

    const u1 = (sprite.sourceRect.x + sprite.sourceRect.width) / sprite.texture.width;
    const v1 = 1 - (sprite.sourceRect.y + sprite.sourceRect.height) / sprite.texture.height;

    // bottom left
    this.data[0] = rect.x; // x
    this.data[1] = rect.y + rect.height; // y
    this.data[2] = u1; // u
    this.data[3] = v1; // v
    this.data[4] = color.r; // r
    this.data[5] = color.g; // g
    this.data[6] = color.b; // b

    // top left
    this.data[7] = rect.x; // x
    this.data[8] = rect.y; // y
    this.data[9] = u1; // u
    this.data[10] = v0; // v
    this.data[11] = color.r; // r
    this.data[12] = color.g; // g
    this.data[13] = color.b; // b

    // bottom right
    this.data[14] = rect.x + rect.width; // x
    this.data[15] = rect.y + rect.height; // y
    this.data[16] = u0 // u
    this.data[17] = v1 // v
    this.data[18] = color.r; // r
    this.data[19] = color.g; // g
    this.data[20] = color.b; // b

    // top right
    this.data[21] = rect.x + rect.width; // x
    this.data[22] = rect.y; // y
    this.data[23] = u0; // u
    this.data[24] = v0; // v
    this.data[25] = color.r; // r
    this.data[26] = color.g; // g
    this.data[27] = color.b; // b
  }

  private spriteDataBatched(rect: Rect, color: Color, sprite: Sprite) {
    this.setSprite(sprite.texture)
    let i = this.batchCount * this.FLOATS_PER_SPRITE;
    // bottom left
    this.data[0 + i] = rect.x; // x
    this.data[1 + i] = rect.y + rect.height; // y
    this.data[2 + i] = 0; // u
    this.data[3 + i] = 0; // v
    this.data[4 + i] = color.r; // r
    this.data[5 + i] = color.g; // g
    this.data[6 + i] = color.b; // b

    // top left
    this.data[7 + i] = rect.x; // x
    this.data[8 + i] = rect.y; // y
    this.data[9 + i] = 0; // u
    this.data[10 + i] = 1; // v
    this.data[11 + i] = color.r; // r
    this.data[12 + i] = color.g; // g
    this.data[13 + i] = color.b; // b

    // bottom right
    this.data[14 + i] = rect.x + rect.width; // x
    this.data[15 + i] = rect.y + rect.height; // y
    this.data[16 + i] = 1 // u
    this.data[17 + i] = 0 // v
    this.data[18 + i] = color.r; // r
    this.data[19 + i] = color.g; // g
    this.data[20 + i] = color.b; // b

    // top right
    this.data[21 + i] = rect.x + rect.width; // x
    this.data[22 + i] = rect.y; // y
    this.data[23 + i] = 1; // u
    this.data[24 + i] = 1; // v
    this.data[25 + i] = color.r; // r
    this.data[26 + i] = color.g; // g
    this.data[27 + i] = color.b; // b
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

    const data = new Uint16Array(this.totalQuads * this.INDICES_PER_SPRITE);

    for (let i = 0; i < this.totalQuads; i++) {
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

  private drawQuadNormal(rect: Rect, color: Color) {
    this.setSprite(this.renderer.whiteTexture);
    this.quadDataNormal(rect, color);
    this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
    this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, this.INDICES_PER_SPRITE, this.renderer.gl.UNSIGNED_SHORT, 0);
  }

  private drawQuadBatched(rect: Rect, color: Color) {
    this.quadDataBatched(rect, color);
    this.batchCount++;
  }

  private drawSpriteNormal(rect: Rect, color: Color, sprite: Sprite) {
    this.spriteDataNormal(rect, color, sprite);
    this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
    this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, this.INDICES_PER_SPRITE, this.renderer.gl.UNSIGNED_SHORT, 0);
  }

  private drawSpriteBatched(rect: Rect, color: Color, sprite: Sprite) {
    this.spriteDataBatched(rect, color, sprite);
    this.batchCount++;
  }

  public batchEnd() {
    const batch = BufferUtil.resizeBuffer(this.totalQuads, this.batchCount);

    this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
    this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, this.INDICES_PER_SPRITE * batch.count, this.renderer.gl.UNSIGNED_SHORT, 0);

    // if batchCount is within 90% of the size of of maxSprites
    // increase the number of maxSprites by 15%
    if (batch.tooBig) {
      this.totalQuads = Math.round(this.batchCount * 1.15);

      this.data = new Float32Array(this.FLOATS_PER_SPRITE * this.totalQuads);
      this.setBuffer();
      this.setVertexAttribPointers();
    }

    this.batchCount = 0;
    this.data = new Float32Array(this.FLOATS_PER_SPRITE * this.totalQuads);
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
  //       const batch = BufferUtil.resizeBuffer(this.totalQuads, this.batchCount);

  //       this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.data);
  //       this.renderer.gl.drawElements(this.renderer.gl.TRIANGLES, this.INDICES_PER_SPRITE * batch.count, this.renderer.gl.UNSIGNED_SHORT, 0);

  //       // if batchCount is within 90% of the size of of maxSprites
  //       // increase the number of maxSprites by 15%
  //       if (batch.tooBig) {
  //         this.totalQuads = Math.round(this.batchCount * 1.15);

  //         this.data = new Float32Array(this.FLOATS_PER_SPRITE * this.totalQuads);
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