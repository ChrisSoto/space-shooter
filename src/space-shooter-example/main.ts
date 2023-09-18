import { Content } from "../dinkum/core/content";
import { Engine } from "../dinkum/core/engine";
import { Resize } from "../dinkum/util/resize";
import { Background } from "./background";
import { BulletManager } from "./bullet-manager";
import { EnemyManager } from "./enemy-manager";
import { ExplosionManager } from "./explosion-manager";
import { Player } from "./player";
import * as TWGL from "../../node_modules/twgl.js/dist/5.x/twgl-full";

console.log();

const engine = new Engine('canvas');

await Content.uploadSpriteSheet(engine.gl, "main", "assets/Spritesheet/sheet.png");
await Content.uploadSprite(engine.gl, "background", "assets/Backgrounds/purple.png");

const resize = new Resize(engine.gl, 1200, 700);
resize.resizeCanvasToDisplaySize();

engine.initialize()
  .then(() => {

    const player = new Player(engine.inputManager, engine.clientBounds[0], engine.clientBounds[1]);
    const background = new Background(engine.clientBounds[0], engine.clientBounds[1]);
    // const explosionManager = new ExplosionManager();
    // const bulletManager = new BulletManager(player);
    const enemyManager = new EnemyManager(engine.clientBounds[0], engine.clientBounds[1], player);

    // update movement
    engine.onUpdate = (dt: number) => {
      resize.resizeCanvasToDisplaySize();
      background.update(dt);
      player.update(dt);
      enemyManager.update(dt);
      // explosionManager.update(dt);
      // bulletManager.update(dt);
    }

    // draw to buffer
    engine.onDraw = () => {
      engine.spriteRenderer.begin();

      // create your game class and inject engine.spriteRenderer

      background.draw(engine.spriteRenderer);
      player.draw(engine.spriteRenderer);
      enemyManager.draw(engine.spriteRenderer);
      // bulletManager.draw(engine.spriteRenderer);
      // explosionManager.draw(engine.spriteRenderer);

      engine.spriteRenderer.end();
    }

    engine.draw();
  })
