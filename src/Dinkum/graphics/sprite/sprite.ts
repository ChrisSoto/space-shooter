import { Rect } from "../rect";
import { Texture } from "./texture";

// if there is an option to either rotate the sprite or rotate the texture
// this is only particular to rotation and therefore, scale and position
// aren't capable of being changed in texture only.

export class Sprite {
  constructor(
    public texture: Texture,
    public rect: Rect,
    public sourceRect: Rect) {

  }
}