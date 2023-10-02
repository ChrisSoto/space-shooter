import { vec2 } from "gl-matrix";
import { InputManager } from "../dinkum/render/input/input-manager";
import { Content } from "../dinkum/render/core/content";
import { RenderLayer } from "../dinkum/render/core/render-layer";
import { Rect } from "../dinkum/render/graphics/rect";
import { Sprite } from "../dinkum/render/graphics/sprite/sprite";
import { Color } from "../dinkum/render/graphics/color";

const SPEED = 0.25;

export class Player {
  private movementDirection = vec2.create();
  public rect: Rect;
  private sprite: Sprite;

  constructor(private inputManager: InputManager, private width: number, private height: number) {
    this.sprite = Content.sprites["playerShip1_red"];
    this.rect = this.sprite.rect.copy();
  }

  public update(dt: number) {
    this.movementDirection[0] = 0;
    this.movementDirection[1] = 0;

    if (this.inputManager.isKeyDown("ArrowUp")) {
      this.movementDirection[1] = -1;
    }
    if (this.inputManager.isKeyDown("ArrowDown")) {
      this.movementDirection[1] = 1;
    }
    if (this.inputManager.isKeyDown("ArrowLeft")) {
      this.movementDirection[0] = -1;
    }
    if (this.inputManager.isKeyDown("ArrowRight")) {
      this.movementDirection[0] = 1;
    }

    vec2.normalize(this.movementDirection, this.movementDirection);
    vec2.scale(this.movementDirection, this.movementDirection, SPEED * dt);
    this.rect.x += this.movementDirection[0];
    this.rect.y += this.movementDirection[1];

    this.keepInBounds();
  }

  public draw(renderer: RenderLayer) {
    renderer.drawSprite(this.rect, new Color(), this.sprite);
  }

  private keepInBounds() {
    if (this.rect.x < 0) {
      this.rect.x = 0;
    } else if (this.rect.x > this.width - this.rect.width) {
      this.rect.x = this.width - this.rect.width;
    }

    if (this.rect.y < 0) {
      this.rect.y = 0;
    } else if (this.rect.y > this.height - this.rect.height) {
      this.rect.y = this.height - this.rect.height;
    }
  }
}