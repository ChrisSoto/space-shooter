import { mat4, vec2, vec3 } from "gl-matrix";

export class Transform {
  private mPosition: vec2;
  private mScale: vec2;
  private mRotationInRad: number; // in radians! need to make this private...

  constructor() {
    this.mPosition = vec2.fromValues(0, 0);  // this is the translation
    this.mScale = vec2.fromValues(1, 1);     // this is the width (x) and height (y)
    this.mRotationInRad = 0.0;               // in radians!
  }
  // position
  setPosition(xPos: number, yPos: number) { this.setXPos(xPos); this.setYPos(yPos); }
  getPosition() { return this.mPosition; }

  getXPos() { return this.mPosition[0]; }
  setXPos(xPos: number) { this.mPosition[0] = xPos; }
  incXPosBy(delta: number) { this.mPosition[0] += delta; }

  getYPos() { return this.mPosition[1]; }
  setYPos(yPos: number) { this.mPosition[1] = yPos; }
  incYPosBy(delta: number) { this.mPosition[1] += delta; }

  // size
  setSize(width: number, height: number) {
    this.setWidth(width);
    this.setHeight(height);
  }
  getSize() { return this.mScale; }
  incSizeBy(delta: number) {
    this.incWidthBy(delta);
    this.incHeightBy(delta);
  }

  // scale
  getWidth() { return this.mScale[0]; }
  setWidth(width: number) { this.mScale[0] = width; }
  incWidthBy(delta: number) { this.mScale[0] += delta; }
  getHeight() { return this.mScale[1]; }
  setHeight(height: number) { this.mScale[1] = height; }
  incHeightBy(delta: number) { this.mScale[1] += delta; }

  // rotation
  setRotationInRad(rotationInRadians: number) {
    this.mRotationInRad = rotationInRadians;
    while (this.mRotationInRad > (2 * Math.PI)) {
      this.mRotationInRad -= (2 * Math.PI);
    }
  }
  setRotationInDegree(rotationInDegree: number) {
    this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
  }
  incRotationByDegree(deltaDegree: number) {
    this.incRotationByRad(deltaDegree * Math.PI / 180.0);
  }
  incRotationByRad(deltaRad: number) {
    this.setRotationInRad(this.mRotationInRad + deltaRad);
  }
  getRotationInRad() { return this.mRotationInRad; }
  getRotationInDegree() { return this.mRotationInRad * 180.0 / Math.PI; }

  // returns the matrix the concatenates the transformations defined
  getTRSMatrix() {
    // Creates a blank identity matrix
    let matrix = mat4.create();

    // The matrices that WebGL uses are transposed, thus the typical matrix
    // operations must be in reverse.

    // Step A: compute translation, for now z is always at 0.0
    mat4.translate(matrix, matrix, vec3.fromValues(this.getXPos(), this.getYPos(), 0.0));
    // Step B: concatenate with rotation.
    mat4.rotateZ(matrix, matrix, this.getRotationInRad());
    // Step C: concatenate with scaling
    mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

    return matrix;
  }
}