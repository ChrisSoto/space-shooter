export class Texture {
  constructor(public texture: WebGLTexture, public width: number, public height: number) { }

  public static async loadTexture(gl: WebGL2RenderingContext, url: string): Promise<Texture> {

    return new Promise<Texture>((resolve, reject) => {

      const image = new Image();
      image.src = url;
      image.onload = () => {
        const texture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image);

        gl.generateMipmap(gl.TEXTURE_2D)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        resolve(new Texture(texture, image.width, image.height));
      }

      image.onerror = (err) => {
        console.error(err);
        reject(err);
      }
    });
  }
}