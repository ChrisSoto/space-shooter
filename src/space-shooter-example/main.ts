import { Content } from "../dinkum/core/content";
import { Engine } from "../dinkum/core/engine";
import { BufferType } from "../dinkum/core/render-layer";
import { Rect } from "../dinkum/graphics/rect";
import { Resize } from "../dinkum/util/resize";
import { RenderLayer } from "../dinkum/core/render-layer";
import { Player } from "./player";
import { Color } from "../dinkum/graphics/color";
import { vec2 } from "gl-matrix";

const engine = new Engine('canvas');

await Content.uploadSpriteSheet(engine.gl, "main", "assets/Spritesheet/sheet.png");

const resize = new Resize(engine.gl, 100, 100);
resize.resizeCanvasToDisplaySize();

engine.initialize()
  .then(() => {
    engine.renderer.layers['player'] = new RenderLayer(engine.renderer, BufferType.NORMAL);
    const player = new Player(engine.inputManager, engine.camera.width, engine.camera.height);
    // const background = new Background(engine.clientBounds[0], engine.clientBounds[1]);
    // const explosionManager = new ExplosionManager();
    // const bulletManager = new BulletManager(player);
    // const enemyManager = new EnemyManager(engine.clientBounds[0], engine.clientBounds[1], player);

    // update movement
    engine.onUpdate = (dt: number) => {
      // background.update(dt);
      player.update(dt);
      // enemyManager.update(dt);
      // explosionManager.update(dt);
      // bulletManager.update(dt);
    }

    // draw to buffer
    engine.onDraw = () => {
      engine.renderer.begin();

      // create your game class and inject engine.spriteRenderer

      // background.draw(engine.spriteRenderer);
      // player.draw(engine.renderer.layers['player']);
      // engine.renderer.layers['player'].drawQuad(new Rect(100, 100, 0, 100, 100), new Color(100, 0, 0, 1))
      engine.renderer.layers['player'].drawLine(
        vec2.set(vec2.create(), 50, 0),
        vec2.set(vec2.create(), 50, 100),
        10, new Color(0, 100, 0, 1))
      // enemyManager.draw(engine.spriteRenderer);
      // bulletManager.draw(engine.spriteRenderer);
      // explosionManager.draw(engine.spriteRenderer);

      engine.renderer.end();
    }

    engine.draw();
  })
