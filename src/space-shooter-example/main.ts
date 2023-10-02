import { Content } from "../dinkum/render/core/content";
import { Engine } from "../dinkum/render/core/engine";
import { BufferType } from "../dinkum/render/core/render-layer";
import { Resize } from "../dinkum/util/resize";
import { RenderLayer } from "../dinkum/render/core/render-layer";
import { Player } from "./player";
import { vec2 } from "gl-matrix";
import { Color } from "../dinkum/render/graphics/color";
import { Rect } from "../dinkum/render/graphics/rect";

const engine = new Engine('canvas');

await Content.uploadSpriteSheet(engine.gl, "main", "assets/Spritesheet/sheet.png");

const resize = new Resize(engine.gl, 1920, 1080);
resize.resizeCanvasToDisplaySize();

engine.initialize()
  .then(() => {
    engine.renderer.layers['tiles'] = new RenderLayer(engine.renderer, BufferType.BATCHED);
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


      createTiles(engine.renderer.layers['tiles']);

      // background.draw(engine.spriteRenderer);
      // player.draw(engine.renderer.layers['player']);
      // engine.renderer.layers['player'].drawQuad(new Rect(100, 100, 0, 100, 100), new Color(100, 0, 0, 1))
      // engine.renderer.layers['player'].drawLine(
      //   vec2.set(vec2.create(), 0, 0),
      //   vec2.set(vec2.create(), 1920, 540),
      //   1, new Color(0, 100, 0, 1))
      // enemyManager.draw(engine.spriteRenderer);
      // bulletManager.draw(engine.spriteRenderer);
      // explosionManager.draw(engine.spriteRenderer);

      engine.renderer.end();
    }

    engine.draw();
  })

function createTiles(render: RenderLayer) {
  const size = 16;
  const rows = Math.floor(1920 / size);
  const cols = Math.floor(1080 / size);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const rect = new Rect(i * size, j * size, 0, size, size);
      render.drawQuad(rect, new Color(Math.random() * 1, Math.random() * 1, Math.random() * 1))
    }
  }

}