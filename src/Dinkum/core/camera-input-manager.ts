import { vec2 } from "gl-matrix";
import { Camera3, CameraTransform } from "../camera/camera";
import { InputManager } from "./input-manager";

export class CameraInputManager {
  sTransform!: CameraTransform; // origin
  sMousePos!: vec2;
  lMousePos!: vec2;
  mousePos!: vec2;
  mouseClipPos!: vec2;
  cSize!: vec2;
  constructor() {
    this.sMousePos = vec2.create();
    this.lMousePos = vec2.create();
    this.mousePos = vec2.create();
    this.mouseClipPos = vec2.create();
    this.cSize = vec2.create();
    this.sTransform = {
      x: 0,
      y: 0,
      rotation: 0,
      zoom: 1,
    };
  }

  initialize(canvas: HTMLCanvasElement, inputManager: InputManager, camera: Camera3) {
    this.cSize[0] = canvas.width;
    this.cSize[1] = canvas.height;
    window.addEventListener("keydown", e => inputManager.keydown[e.key] = true);
    window.addEventListener("keyup", e => inputManager.keydown[e.key] = false);

    canvas.addEventListener("wheel", e => {
      this.getMousePosition(e, canvas)
      inputManager.wheel.backward = e.deltaY > 0;
      inputManager.wheel.forward = e.deltaY < 0;
    })

    canvas.addEventListener("mousedown", e => {
      inputManager.mouseDown[e.button] = true
      if (inputManager.mouseDown[1]) {
        this.sTransform.x = camera.transform.x;
        this.sTransform.y = camera.transform.y;
        this.sMousePos[0] = this.mousePos[0];
        this.sMousePos[1] = this.mousePos[1];
      }
    })
    canvas.addEventListener("mousemove", e => {
      this.getMousePosition(e, canvas)
      inputManager.mouseMove = true;
      if (inputManager.mouseDown[1]) {
        inputManager.panActive = true;
      }
    })
    canvas.addEventListener("mouseup", e => {
      inputManager.mouseDown[e.button] = false
      inputManager.mouseMove = false;
      inputManager.panActive = false;
    })
  }

  public pan() {
    return [
      this.sTransform.x - this.sMousePos[0] + this.mousePos[0],
      this.sTransform.y - this.sMousePos[1] + this.mousePos[1],
    ];
  }

  private getMousePosition(event: WheelEvent | MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaledX = event.clientX - rect.left;
    const scaledY = event.clientY - rect.top;
    const widthRatio = canvas.width / canvas.clientWidth;
    const heightRatio = canvas.height / canvas.clientHeight;
    const normalizedX = scaledX * widthRatio;
    const normalizedY = scaledY * heightRatio;
    this.mousePos = [normalizedX, normalizedY];
  }

  public getScreenFromClip(pos: number[]) {
    return [
      (this.cSize[0] * (pos[0] + 1)) / 2,
      (this.cSize[1] * (pos[1] - 1)) / -2,
    ]
  }

  public getClipFromScreen(pos: number[]) {
    return [
      (pos[0] / this.cSize[0]) * 2 - 1,
      (pos[1] / this.cSize[1]) * -2 + 1,
    ]
  }
}