
import { InputManager } from "./input-manager";
import Renderer2D from "./renderer2d";
import { Camera3 } from "../camera/camera3";
import { CameraInputManager } from "./camera-input-manager";


export class Engine {
  private canvas: HTMLCanvasElement;
  public gl!: WebGL2RenderingContext;
  private lastTime = 0;
  // public spriteRenderer!: SpriteRenderer;
  public renderer!: Renderer2D;
  public camera!: Camera3;
  public inputManager = new InputManager();
  public cameraInputManager = new CameraInputManager();

  public onUpdate = (_dt: number) => { };
  public onDraw = () => { };

  constructor(private canvasId: string) {
    this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
    this.gl = this.canvas.getContext('webgl2', { alpha: true }) as WebGL2RenderingContext;
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  }

  public async initialize() {
    this.camera = new Camera3(this.gl, this.canvas.width, this.canvas.height);
    this.renderer = new Renderer2D(this.gl, this.camera)
    await this.renderer.initialize();
    this.cameraInputManager.initialize(this.canvas, this.inputManager, this.camera);
  }

  public draw() {

    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;
    this.camera.update(this.inputManager, this.cameraInputManager, dt);

    this.camera.updateProjectionView();

    this.onUpdate(dt);

    this.camera.clear();

    this.onDraw();

    // game loop
    window.requestAnimationFrame(() => this.draw())
  }
}