import { Rect } from "../dinkum/graphics/rect";
import { SpriteRenderer } from "../old_dinkum_stuff/sprite-renderer";

export interface Enemy {
  active: boolean;
  drawRect: Rect;

  update(dt: number): void;
  draw(spriteRenderer: SpriteRenderer): void;
}