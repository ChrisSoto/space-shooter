import { Content } from "../Dinkum/core/content";
import { Rect } from "../Dinkum/graphics/rect";
import { SpriteRenderer } from "../Dinkum/graphics/sprite/sprite-renderer";
import { Texture } from "../Dinkum/graphics/sprite/texture";
import { Player } from "./player";

const BULLET_SPEED = 0.75;

export class Bullet {
  public drawRect: Rect;
  private sourceRect: Rect;
  private texture: Texture;

  public active = true;

  constructor() {
    const sprite = Content.sprites["laserBlue01"];
    this.texture = sprite.texture;
    this.drawRect = sprite.drawRect.copy();
    this.sourceRect = sprite.sourceRect.copy();
  }

  public spawn(player: Player) {
    this.active = true;
    this.drawRect.x = player.drawRect.x + player.drawRect.width / 2 - this.drawRect.width / 2;
    this.drawRect.y = player.drawRect.y - this.drawRect.height;
  }

  update(dt: number) {
    this.drawRect.y -= BULLET_SPEED * dt;

    if (this.drawRect.y + this.drawRect.height < 0) {
      this.active = false;
    }
  }

  draw(spriteRenderer: SpriteRenderer) {
    spriteRenderer.drawSpriteSource(this.texture, this.drawRect, this.sourceRect);
  }
}