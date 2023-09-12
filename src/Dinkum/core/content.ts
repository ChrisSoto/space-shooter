import { Rect } from "../graphics/rect";
import { Sprite } from "../graphics/sprite/sprite";
import { Texture } from "../graphics/sprite/texture";

export interface SpriteSheetData {
  texture: Texture;
  xmlDoc: Document;
}

export class Content {
  private static spriteSheets: { [id: string]: SpriteSheetData } = {};
  public static sprites: { [id: string]: Sprite } = {};
  public static testUVTexture: Texture;

  public static async initialize(gl: WebGL2RenderingContext) {
    this.testUVTexture = await Texture.loadTexture(gl, "assets/uvTexture.png")
    // this.backgroundTexture = await Texture.loadTexture(gl, "assets/Backgrounds/purple.png");
    // this.explosionTexture = await Texture.loadTexture(gl, "assets/explosion.png")

    // await this.loadSpriteSheet();
  }

  public static async uploadSprite(gl: WebGL2RenderingContext, key: string, url: string) {
    const texture = await Texture.loadTexture(gl, url);
    const width = texture.width;
    const height = texture.height;
    const drawRect = new Rect(0, 0, width, height);
    const srcRect = new Rect(0, 0, width, height);

    this.sprites[key] = new Sprite(texture, drawRect, srcRect);
  }

  /**
   *  uploadSpriteSheet
   * @param name - name of spritesheet used to access from Content.spritesheets
   * @param url - url of spritesheet
   */

  public static async uploadSpriteSheet(gl: WebGL2RenderingContext, name: string, url: string) {
    // todo: sluggify name
    this.spriteSheets[name] = {
      texture: await Texture.loadTexture(gl, url),
      xmlDoc: await this.loadXmlDoc(url)
    }

    console.log('Uploaded Sprite Sheet: ', this.spriteSheets[name]);

    this.loadSpritesToSpritesheet(name);
  }

  private static loadSpritesToSpritesheet(spriteSheetName: string) {
    const spritesheet = this.spriteSheets[spriteSheetName];
    spritesheet.xmlDoc.querySelectorAll("SubTexture")
      .forEach((texture) => {
        const name = texture.getAttribute("name")!.replace(".png", "");
        const x = parseInt(texture.getAttribute("x")!)
        const y = parseInt(texture.getAttribute("y")!)
        const width = parseInt(texture.getAttribute("width")!)
        const height = parseInt(texture.getAttribute("height")!)

        const drawRect = new Rect(0, 0, width, height);
        const srcRect = new Rect(x, y, width, height);

        this.sprites[name] = new Sprite(spritesheet.texture, drawRect, srcRect);
      });
  }

  private static async loadXmlDoc(xmlUrl: string): Promise<Document> {
    const url = xmlUrl.replace('png', 'xml');
    const xmlReq = await fetch(url);
    const xml = await xmlReq.text();
    const parser = new DOMParser();

    return new Promise<Document>((resolve, reject) => {
      resolve(parser.parseFromString(xml, "text/xml"));
      reject('Error')
    });
  }

  // private static async loadSpriteSheet() {
  //   const xmlDoc = await this.loadXmlDoc("assets/Spritesheet/sheet.xml");
  //   xmlDoc.querySelectorAll("SubTexture")
  //     .forEach((texture) => {
  //       const name = texture.getAttribute("name")!.replace(".png", "");
  //       const x = parseInt(texture.getAttribute("x")!)
  //       const y = parseInt(texture.getAttribute("y")!)
  //       const width = parseInt(texture.getAttribute("width")!)
  //       const height = parseInt(texture.getAttribute("height")!)

  //       const drawRect = new Rect(0, 0, width, height);
  //       const srcRect = new Rect(x, y, width, height);

  //       this.sprites[name] = new Sprite(this.spriteSheet, drawRect, srcRect);
  //     })
  // }
}