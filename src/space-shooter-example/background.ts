import { Content } from "../dinkum/core/content";
import { Rect } from "../dinkum/graphics/rect";
import { SpriteRenderer } from "../old_dinkum_stuff/sprite-renderer";

const BACKGROUND_SCROLL_SPEED = 0.15;

export class Background {
  private drawRect: Rect;
  private drawRect2: Rect;
  private key: string = "background";
  constructor(private width: number, private height: number) {
    this.drawRect = new Rect(0, 0, this.width, this.height);
    this.drawRect2 = new Rect(0, 0, this.width, this.height);
  }

  public update(dt: number) {
    this.drawRect.y += BACKGROUND_SCROLL_SPEED * dt;
    this.drawRect2.y = this.drawRect.y - this.height;
    if (this.drawRect.y > this.height || this.drawRect2.y > this.height) {
      const temp = this.drawRect;
      this.drawRect = this.drawRect2;
      this.drawRect2 = temp;
    }
  }

  public draw(spriteRenderer: SpriteRenderer) {
    spriteRenderer.drawSprite(Content.sprites[this.key].texture, this.drawRect);
    spriteRenderer.drawSprite(Content.sprites[this.key].texture, this.drawRect2);
  }

}