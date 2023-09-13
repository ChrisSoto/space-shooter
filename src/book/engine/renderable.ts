/*
 * File: renderable.js
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */

import { vec4 } from "gl-matrix";
import * as glSys from "../core/gl.js";
import * as shaderResources from "../core/shader_resource";
import SimpleShader from "../simple_shader.js";

class Renderable {
  mShader: SimpleShader;
  mColor: vec4;
  constructor() {
    this.mShader = shaderResources.getConstColorShader();   // the shader for shading this object
    this.mColor = [1, 1, 1, 1];    // color of pixel
  }

  draw() {
    let gl = glSys.get();
    if (gl) {
      this.mShader.activate(this.mColor);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  setColor(color: vec4) { this.mColor = color; }
  getColor() { return this.mColor; }
}

export default Renderable;