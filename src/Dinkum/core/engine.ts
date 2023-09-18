
import { vec2 } from "gl-matrix";
import { InputManager } from "./input-manager";
import { SpriteRenderer } from "../graphics/sprite/sprite-renderer";
import { Camera } from "../camera/camera";


export class Engine {
  private canvas: HTMLCanvasElement;
  public gl!: WebGL2RenderingContext;
  private lastTime = 0;
  public spriteRenderer!: SpriteRenderer;
  public inputManager = new InputManager();
  public clientBounds = vec2.create();
  public camera!: Camera;


  public onUpdate = (_dt: number) => { };
  public onDraw = () => { };

  constructor(private canvasId: string) {
    this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
    this.gl = this.canvas.getContext('webgl2', { alpha: false }) as WebGL2RenderingContext;
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  }

  public async initialize() {
    this.inputManager.initialize();
    this.clientBounds[0] = this.canvas.width;
    this.clientBounds[1] = this.canvas.height;
    this.camera = new Camera(this.gl, this.canvas.width, this.canvas.height);
    this.spriteRenderer = new SpriteRenderer(this.gl, this.camera);
    await this.spriteRenderer.initialize();
  }

  public draw() {

    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    this.camera.update();

    this.onUpdate(dt);

    this.camera.clear();

    this.onDraw();

    // game loop
    window.requestAnimationFrame(() => this.draw())
  }
}