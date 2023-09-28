
import { InputManager } from "./input-manager";
import Renderer2D from "./renderer2d";
import { Camera3 } from "../camera/camera3";


export class Engine {
  private canvas: HTMLCanvasElement;
  public gl!: WebGL2RenderingContext;
  private lastTime = 0;
  // public spriteRenderer!: SpriteRenderer;
  public renderer!: Renderer2D;
  public inputManager = new InputManager();
  public camera!: Camera3;


  public onUpdate = (_dt: number) => { };
  public onDraw = () => { };

  constructor(private canvasId: string) {
    this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
    this.gl = this.canvas.getContext('webgl2', { alpha: false }) as WebGL2RenderingContext;
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  }

  public async initialize() {
    this.inputManager.initialize();
    this.camera = new Camera3(this.gl, this.canvas.width, this.canvas.height);
    this.renderer = new Renderer2D(this.gl, this.camera)
    await this.renderer.initialize();
  }

  public draw() {

    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;
    this.camera.update(this.inputManager, dt);
    this.camera.updateProjectionView();

    this.onUpdate(dt);

    this.camera.clear();

    this.onDraw();

    // game loop
    window.requestAnimationFrame(() => this.draw())
  }
}