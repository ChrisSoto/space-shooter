/*
 * File: gl.js
 *  
 * handles initialization with gl
 * 
 */

let mCanvas: HTMLCanvasElement | null;
let mGL: WebGL2RenderingContext;

function get() { return mGL; }

function cleanUp() {
  if ((mGL == null) || (mCanvas == null))
    throw new Error("Engine cleanup: system is not initialized.");

  // that's crazy
  // mGL = null;

  // let the user know
  mCanvas.style.position = "fixed";
  mCanvas.style.backgroundColor = "rgba(200, 200, 200, 0.5)";
  mCanvas = null;

  document.body.innerHTML += "<br><br><h1>End of Game</h1><h1>GL System Shut Down</h1>";

}

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

export { init, get, cleanUp }