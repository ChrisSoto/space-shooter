/*
 * File: gl.js
 *  
 * handles initialization with gl
 * 
 */

let mCanvas: HTMLCanvasElement | null;
let mGL: WebGL2RenderingContext;

function get() { return mGL; }

function init(htmlCanvasID: string) {
  mCanvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;
  if (mCanvas == null)
    throw new Error("Engine init [" + htmlCanvasID + "] HTML element id not found");

  // Get the standard or experimental webgl and binds to the Canvas area
  // store the results to the instance variable mGL
  const context = mCanvas.getContext("webgl2");
  if (context) {
    mGL = context;
  }

  if (mGL === null) {
    document.write("<br><b>WebGL 2 is not supported!</b>");
    return;
  }
}

export { init, get }