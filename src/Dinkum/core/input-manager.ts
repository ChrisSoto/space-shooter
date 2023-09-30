import { vec2 } from "gl-matrix";

export class InputManager {
  public origin = vec2.create();
  public keydown: { [key: string]: boolean } = {};
  public mouseDown: { [key: string]: boolean } = {};
  public mouseMove: boolean = false;
  public panActive: boolean = false;
  public panOffset = vec2.create();
  public mouse = vec2.create();
  public mouseHoldStart: number[] = [0, 0];
  public wheel: { forward: boolean, backward: boolean } = { forward: false, backward: false };
  public transformActive: boolean = false;
  public startTranslate = vec2.create();
  public startMouse = vec2.create();

  public isKeyDown(key: string): boolean {
    return this.keydown[key];
  }

  public isKeyUp(key: string): boolean {
    return !this.keydown[key];
  }

}