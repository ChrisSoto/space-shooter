
import { vec2 } from "gl-matrix";
import { Content } from "./content";
import { InputManager } from "./input-manager";
import { SpriteRenderer } from "../graphics/sprite/sprite-renderer";

export class Engine {
  // private canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  // public gl: WebGL2RenderingContext = this.canvas.getContext('webgl2', { alpha: false }) as WebGL2RenderingContext;
  private canvas!: HTMLCanvasElement;
  public gl!: WebGL2RenderingContext;
  private lastTime = 0;

  public spriteRenderer!: SpriteRenderer;
  public inputManager = new InputManager();

  public clientBounds = vec2.create();

  public onUpdate = (dt: number) => { };
  public onDraw = () => { };

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.gl = this.canvas.getContext('webgl2', { alpha: false }) as WebGL2RenderingContext;
    console.log(this.gl);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  }

  public async initialize() {
    // this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    // this.gl = this.canvas.getContext('webgl2', { alpha: false }) as WebGL2RenderingContext;
    // this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.inputManager.initialize();

    this.clientBounds[0] = this.canvas.width;
    this.clientBounds[1] = this.canvas.height;

    // await Content.initialize(this.gl);

    this.spriteRenderer = new SpriteRenderer(this.gl, this.canvas.width, this.canvas.height);
    await this.spriteRenderer.initialize();
  }

  public draw() {

    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    this.onUpdate(dt);

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0.8, 0.8, 0.8, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.onDraw();

    // game loop
    window.requestAnimationFrame(() => this.draw())
  }
}