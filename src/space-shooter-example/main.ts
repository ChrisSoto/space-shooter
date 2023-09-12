import { Content } from "../dinkum/core/content";
import { Engine } from "../dinkum/core/engine";
import { Background } from "./background";
import { BulletManager } from "./bullet-manager";
import { EnemyManager } from "./enemy-manager";
import { ExplosionManager } from "./explosion-manager";
import { Player } from "./player";

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

const engine = new Engine(canvas);

await Content.uploadSpriteSheet(engine.gl, "main", "assets/Spritesheet/sheet.png");
await Content.uploadSprite(engine.gl, "background", "assets/Backgrounds/purple.png");

engine.initialize()
  .then(() => {

    const player = new Player(engine.inputManager, engine.clientBounds[0], engine.clientBounds[1]);
    const background = new Background(engine.clientBounds[0], engine.clientBounds[1]);
    // const explosionManager = new ExplosionManager();
    // const bulletManager = new BulletManager(player);
    const enemyManager = new EnemyManager(engine.clientBounds[0], engine.clientBounds[1], player);

    // update movement
    engine.onUpdate = (dt: number) => {
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
