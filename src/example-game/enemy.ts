import { Rect } from "../Dinkum/graphics/rect";
import { SpriteRenderer } from "../Dinkum/graphics/sprite/sprite-renderer";

export interface Enemy {
  active: boolean;
  drawRect: Rect;

  update(dt: number): void;
  draw(spriteRenderer: SpriteRenderer): void;
}