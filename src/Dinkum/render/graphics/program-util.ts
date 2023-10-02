export class ProgramUtil {
  constructor() { }
  /**
 * 
 * @param vertexShader - vertex shader
 * @param fragmentShader - fragment shader
 * @returns {WebGLProgram}
 */
  public static createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | undefined {
    const program = gl.createProgram()!;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (linked) {
      return program;
    }

    console.error(`Shader program failed to load: ${gl.getProgramInfoLog(program)}`);
    gl.deleteProgram(program);
  }

  /**
   * 
   * @param type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
   * @param shaderSource - shader source code
   * @returns {WebGLShader}
   */
  public static createShader(gl: WebGL2RenderingContext, type: number, shaderSource: string): WebGLShader | undefined {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (compiled) {
      return shader;
    }

    console.error(`Shader failed to compile: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
  }
}