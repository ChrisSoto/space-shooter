import { Content } from "../dinkum/core/content";
import { Engine } from "../dinkum/core/engine";
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
      engine.spriteRenderer.begin();
      // editor.draw(engine.camera);
      engine.spriteRenderer.end();
    }

    engine.draw();
  })
