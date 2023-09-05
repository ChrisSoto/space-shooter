import { Rect } from "../graphics/rect";
import { SpriteRenderer } from "../graphics/sprite/sprite-renderer";

export interface Enemy {
  active: boolean;
  drawRect: Rect;

  update(dt: number): void;
  draw(spriteRenderer: SpriteRenderer): void;
}