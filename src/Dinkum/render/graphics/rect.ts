import { vec2 } from "gl-matrix";

export class Rect {
  public angle = 0; // in radians
  public origin = vec2.create();
  public cull = false;
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public width: number,
    public height: number
  ) { }

  public copy(): Rect {
    return new Rect(this.x, this.y, this.z, this.width, this.height);
  }

  public intersects(other: Rect): boolean {
    return this.x < other.x + other.width
      && this.x + this.width > other.x
      && this.y < other.y + other.height
      && this.y + this.height > other.y;
  }
}