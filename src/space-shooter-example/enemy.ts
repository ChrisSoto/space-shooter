import { Rect } from "../dinkum/graphics/rect";
import { SpriteRenderer } from "../dinkum/graphics/sprite/sprite-renderer";

export interface Enemy {
  active: boolean;
  drawRect: Rect;

  update(dt: number): void;
  draw(spriteRenderer: SpriteRenderer): void;
}