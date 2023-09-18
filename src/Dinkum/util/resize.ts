export class Resize {
  private canvasToDisplaySizeMap: Map<HTMLCanvasElement | OffscreenCanvas, number[]>;
  private resizeObserver: ResizeObserver;
  constructor(public gl: WebGL2RenderingContext, public width: number, public height: number) {
    this.canvasToDisplaySizeMap = new Map([[this.gl.canvas, [this.width, this.height]]]);
    this.resizeObserver = new ResizeObserver(this.onResize);
  }

  private onResize(entries: any[]) {
    console.log(entries)
    for (const entry of entries) {
      let width;
      let height;
      let dpr = window.devicePixelRatio;
      if (entry.devicePixelContentBoxSize) {
        // NOTE: Only this path gives the correct answer
        // The other 2 paths are an imperfect fallback
        // for browsers that don't provide anyway to do this
        width = entry.devicePixelContentBoxSize[0].inlineSize;
        height = entry.devicePixelContentBoxSize[0].blockSize;
        dpr = 1; // it's already in width and height
      } else if (entry.contentBoxSize) {
        if (entry.contentBoxSize[0]) {
          width = entry.contentBoxSize[0].inlineSize;
          height = entry.contentBoxSize[0].blockSize;
        } else {
          // legacy
          width = entry.contentBoxSize.inlineSize;
          height = entry.contentBoxSize.blockSize;
        }
      } else {
        // legacy
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
      const displayWidth = Math.round(width * dpr);
      const displayHeight = Math.round(height * dpr);
      this.canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
    }
  }

  public resizeCanvasToDisplaySize() {
    // Get the size the browser is displaying the canvas in device pixels.
    const [displayWidth, displayHeight] = this.canvasToDisplaySizeMap.get(this.gl.canvas)!;

    // Check if the canvas is not the same size.
    const needResize = this.gl.canvas.width !== displayWidth ||
      this.gl.canvas.height !== displayHeight;

    if (needResize) {
      // Make the canvas the same size
      this.gl.canvas.width = displayWidth;
      this.gl.canvas.height = displayHeight;
    }

    return needResize;
  }
}