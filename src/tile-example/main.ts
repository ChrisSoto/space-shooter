import { Content } from "../dinkum/render/core/content";
import { Engine } from "../dinkum/render/core/engine";
import { Editor } from "./editor";

const engine = new Engine('canvas');


await Content.uploadSpriteSheet(engine.gl, "main", "assets/Spritesheet/sheet.png");
await Content.uploadSprite(engine.gl, "background", "assets/Backgrounds/purple.png");

engine.initialize()
  .then(() => {
    const editor = new Editor();
    // update movement
    engine.onUpdate = (dt: number) => {
      editor.update(dt);
    }

    // draw to buffer
    engine.onDraw = () => {
      engine.renderer.begin();
      // editor.draw(engine.camera);
      engine.renderer.end();
    }

    engine.draw();
  })
