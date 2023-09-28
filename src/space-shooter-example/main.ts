import { Content } from "../dinkum/core/content";
import { Engine } from "../dinkum/core/engine";
import { BufferType } from "../dinkum/core/render-layer";
import { RenderLayer2D } from "../dinkum/core/render-layer2d";
import { Resize } from "../dinkum/util/resize";
import { Player } from "./player";

const engine = new Engine('canvas');

await Content.uploadSpriteSheet(engine.gl, "main", "assets/Spritesheet/sheet.png");

const resize = new Resize(engine.gl, 1200, 700);
resize.resizeCanvasToDisplaySize();

engine.initialize()
  .then(() => {
    engine.renderer.layers['player'] = new RenderLayer2D(engine.renderer, BufferType.NORMAL);
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
      player.draw(engine.renderer.layers['player']);
      // enemyManager.draw(engine.spriteRenderer);
      // bulletManager.draw(engine.spriteRenderer);
      // explosionManager.draw(engine.spriteRenderer);

      engine.renderer.end();
    }

    engine.draw();
  })
