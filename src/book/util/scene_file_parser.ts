/*
 * scene file parsing utils
 */

// Engine utility stuff
import { vec2, vec4 } from "gl-matrix";
import engine from "../engine/index";
import Renderable from "../engine/renderable";

class SceneFileParser {
  xml: Document;

  constructor(xml: Document) {
    this.xml = xml
  }

  parseCamera() {
    let camElm = getElm(this.xml, "Camera");
    let cx = parseInt(camElm[0].getAttribute("CenterX")!);
    let cy = parseInt(camElm[0].getAttribute("CenterY")!);
    let w = parseInt(camElm[0].getAttribute("Width")!); 9
    let viewport = camElm[0].getAttribute("Viewport")?.split(" ").map(v => +v)!;
    let bgColor = camElm[0].getAttribute("BgColor")?.split(" ").map(v => +v)!;
    console.log(bgColor)
    // make sure viewport and color are number

    let cam = new engine.Camera(
      vec2.fromValues(cx, cy),  // position of the camera
      w,                        // width of camera
      vec4.fromValues(viewport[0], viewport[1], viewport[2], viewport[3])                 // viewport (orgX, orgY, width, height)
    );
    cam.setBackgroundColor(vec4.fromValues(bgColor[0], bgColor[1], bgColor[2], bgColor[3]));
    return cam;

  }

  parseSquares(sqSet: Renderable[]) {
    let elm = getElm(this.xml, "Square");
    let i, x, y, w, h, r, c, sq;
    for (i = 0; i < elm.length; i++) {
      x = Number(elm.item(i)?.attributes.getNamedItem("PosX")?.value);
      y = Number(elm.item(i)?.attributes.getNamedItem("PosY")?.value);
      w = Number(elm.item(i)?.attributes.getNamedItem("Width")?.value);
      h = Number(elm.item(i)?.attributes.getNamedItem("Height")?.value);
      r = Number(elm.item(i)?.attributes.getNamedItem("Rotation")?.value);
      c = elm.item(i)?.attributes.getNamedItem("Color")?.value.split(" ").map(v => parseInt(v))!;
      sq = new engine.Renderable();
      // make sure color array contains numbers
      sq.setColor(vec4.fromValues(c[0], c[1], c[2], c[3]));
      sq.getXform().setPosition(x, y);
      sq.getXform().setRotationInDegree(r); // In Degree
      sq.getXform().setSize(w, h);
      sqSet.push(sq);
    }
  }
}

function getElm(xmlContent: Document, tagElm: string) {
  let theElm = xmlContent.getElementsByTagName(tagElm);
  if (theElm.length === 0) {
    console.error("Warning: Level element:[" + tagElm + "]: is not found!");
  }
  return theElm;
}


export default SceneFileParser;