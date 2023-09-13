import { Transform } from "../../transform";
import { Rect } from "../rect";
import { Texture } from "./texture";

// if there is an option to either rotate the sprite or rotate the texture
// this is only particular to rotation and therefore, scale and position
// aren't capable of being changed in texture only.

export class Sprite {
  public transform = new Transform();
  constructor(
    public texture: Texture,
    public drawRect: Rect,
    public sourceRect: Rect) {

  }
}