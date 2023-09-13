/*
 * File: renderable.js
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */

import { mat4, vec4 } from "gl-matrix";
import * as glSys from "./core/gl";
import * as shaderResources from "./core/shader_resource";
import SimpleShader from "../simple_shader";
import { Transform } from "./transform";
import Camera from "./camera";

class Renderable {
  mShader: SimpleShader;
  mColor: vec4;
  mXform = new Transform();
  constructor() {
    this.mShader = shaderResources.getConstColorShader();   // the shader for shading this object
    this.mColor = [1, 1, 1, 1];    // color of pixel
  }

  getXform() {
    return this.mXform;
  }

  draw(camera: Camera) {
    let gl = glSys.get();
    this.mShader.activate(this.mColor, this.getXform().getTRSMatrix(), camera.getCameraMatrix());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  }

  setColor(color: vec4) { this.mColor = color; }
  getColor() { return this.mColor; }
}

export default Renderable;