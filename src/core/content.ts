import { Rect } from "../graphics/rect";
import { Sprite } from "../graphics/sprite/sprite";
import { Texture } from "../graphics/sprite/texture";

export class Content {
  private static spriteSheet: Texture;

  public static sprites: { [id: string]: Sprite } = {};
  public static testUVTexture: Texture;
  public static backgroundTexture: Texture;
  public static explosionTexture: Texture;

  public static async initialize(gl: WebGL2RenderingContext) {
    this.spriteSheet = await Texture.loadTexture(gl, "assets/Spritesheet/sheet.png");
    this.testUVTexture = await Texture.loadTexture(gl, "assets/uvTexture.png")
    this.backgroundTexture = await Texture.loadTexture(gl, "assets/Backgrounds/purple.png");
    this.explosionTexture = await Texture.loadTexture(gl, "assets/explosion.png")

    await this.loadSpriteSheet();
  }

  private static async loadSpriteSheet() {
    const xmlReq = await fetch("assets/Spritesheet/sheet.xml");
    const xml = await xmlReq.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    xmlDoc.querySelectorAll("SubTexture")
      .forEach((texture) => {
        const name = texture.getAttribute("name")!.replace(".png", "");
        const x = parseInt(texture.getAttribute("x")!)
        const y = parseInt(texture.getAttribute("y")!)
        const width = parseInt(texture.getAttribute("width")!)
        const height = parseInt(texture.getAttribute("height")!)

        const drawRect = new Rect(0, 0, width, height);
        const srcRect = new Rect(x, y, width, height);

        this.sprites[name] = new Sprite(this.spriteSheet, drawRect, srcRect);
      })
  }
}