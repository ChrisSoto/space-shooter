/*
 * File: shader_resources.js
 *  
 * defines drawing system shaders
 * 
 */

import SimpleShader from "../../simple_shader.js";
import kSimpleVS from "../core/glsl_shaders/simple_vs.glsl?raw";
import kSimpleFS from "../core/glsl_shaders/simple_fs.glsl?raw";

// Simple Shader
let mConstColorShader: SimpleShader;

function createShaders() {
  mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
}

function cleanUp() {
  mConstColorShader.cleanUp();
  // text.unload(kSimpleVS);
  // text.unload(kSimpleFS);
}

function init() {
  createShaders();
}
function getConstColorShader() { return mConstColorShader; }

export { init, getConstColorShader, cleanUp }