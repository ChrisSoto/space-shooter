/* 
 * File: simple_shader.js
 * 
 * Defines the SimpleShader class
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import { mat4, vec4 } from "gl-matrix";
import * as glSys from "./core/gl.js";
import * as vertexBuffer from "./core/vertex_buffer";

class SimpleShader {
  mCompiledShader: WebGLProgram | null;
  mVertexPositionRef: GLint | null;
  mPixelColorRef: WebGLUniformLocation | null;
  mVertexShader: WebGLShader | null = null;
  mFragmentShader: WebGLShader | null = null;
  mModelMatrixRef: WebGLUniformLocation | null;
  mCameraMatrixRef: WebGLUniformLocation | null;

  // constructor of SimpleShader object
  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    // instance variables
    // Convention: all instance variables: mVariables
    this.mCompiledShader = null;  // reference to the compiled shader in webgl context  
    this.mVertexPositionRef = null; // reference to VertexPosition within the shader
    this.mPixelColorRef = null;     // reference to the pixelColor uniform in the fragment shader
    this.mModelMatrixRef = null;
    this.mCameraMatrixRef = null;

    let gl = glSys.get();

    if (gl) {
      // 
      // Step A: load and compile vertex and fragment shaders
      this.mVertexShader = loadAndCompileShader(gl.VERTEX_SHADER, vertexShaderSource);
      this.mFragmentShader = loadAndCompileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

      // Step B: Create and link the shaders into a program.
      this.mCompiledShader = gl.createProgram();
      if (this.mCompiledShader && this.mVertexShader && this.mFragmentShader) {
        gl.attachShader(this.mCompiledShader, this.mVertexShader);
        gl.attachShader(this.mCompiledShader, this.mFragmentShader);
        gl.linkProgram(this.mCompiledShader);

        // Step C: check for error
        if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
          console.error(`Shader program failed to load: ${gl.getProgramInfoLog(this.mCompiledShader)}`)
        } else {
          console.log('good program link');
        }

        // Step D: Gets a reference to the aVertexPosition attribute within the shaders.
        this.mVertexPositionRef = gl.getAttribLocation(this.mCompiledShader, "aVertexPosition");

        // Step E: Gets a reference to the uniform variable in the fragment shader
        this.mPixelColorRef = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
        this.mModelMatrixRef = gl.getUniformLocation(this.mCompiledShader, "uModelXformMatrix");
        this.mCameraMatrixRef = gl.getUniformLocation(this.mCompiledShader, "uCameraXformMatrix");
      }
    }
  }


  // Activate the shader for rendering
  activate(pixelColor: vec4, trsMatrix: mat4, cameraMatrix: mat4) {
    let gl = glSys.get();
    if (gl && this.mVertexPositionRef !== null && this.mVertexPositionRef > -1) {
      gl.useProgram(this.mCompiledShader);

      // bind vertex buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.get());
      gl.vertexAttribPointer(this.mVertexPositionRef,
        3,              // each element is a 3-float (x,y.z)
        gl.FLOAT,       // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);             // offsets to the first element
      gl.enableVertexAttribArray(this.mVertexPositionRef);

      // load uniforms
      gl.uniform4fv(this.mPixelColorRef, pixelColor);
      gl.uniformMatrix4fv(this.mModelMatrixRef, false, trsMatrix);
      gl.uniformMatrix4fv(this.mCameraMatrixRef, false, cameraMatrix);
    }
  }
}

//**-----------------------------------
// Private methods not visible outside of this file
// **------------------------------------

// 
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function loadAndCompileShader(shaderType: any, shaderSource: string) {
  let compiledShader: WebGLShader | null;
  let gl = glSys.get();

  if (gl) {
    // Step B: Create the shader based on the shader type: vertex or fragment
    compiledShader = gl.createShader(shaderType);

    if (compiledShader) {
      // Step C: Compile the created shader
      gl.shaderSource(compiledShader, shaderSource);
      gl.compileShader(compiledShader);

      // Step D: check for errors and return results (null if error)
      // The log info is how shader compilation errors are typically displayed.
      // This is useful for debugging the shaders.
      if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        throw new Error("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
      }

      return compiledShader;
    }
  }

  return null
}
//-- end of private methods


//
// export the class, the default keyword says importer of this class cannot change the name "SimpleShader"
// for this reason, to import this class, one must issue
//      import SimpleShader from "./simple_shader.js";
// attempt to change name, e.g., 
//      import SimpleShader as MyShaderName from "./simple_shader.js";
// will result in failure
// 
export default SimpleShader;