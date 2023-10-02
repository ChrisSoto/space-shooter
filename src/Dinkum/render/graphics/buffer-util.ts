export class BufferUtil {
  constructor() { }

  /**
   * creates buffer to store data to gpu
   * @param data 
   * @returns {WebGLBuffer}
   */
  public static createArrayBuffer(gl: WebGL2RenderingContext, data: Float32Array | Float64Array): WebGLBuffer {
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

    return buffer;
  }

  public static createVertexArrayObject(gl: WebGL2RenderingContext, data: Float32Array | Float64Array) {
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    return gl.createVertexArray();
  }

  /**
   * creates buffer to store data to gpu
   * @param data 
   * @returns {WebGLBuffer}
   */
  public static createIndexBuffer(gl: WebGL2RenderingContext, data: Uint8Array | Uint16Array | Uint32Array): WebGLBuffer {
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return buffer;
  }

  public static resizeBuffer(totalQuads: number, batchCount: number) {
    if (batchCount <= totalQuads) {
      return {
        tooBig: false,
        count: batchCount
      };
    } else {
      return {
        tooBig: true,
        count: totalQuads
      }
    }
  }
}