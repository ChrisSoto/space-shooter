export class InputManager {
  public keydown: { [key: string]: boolean } = {};
  public mouseDown: { [key: string]: boolean } = {};
  public mouseMove: boolean = false;
  public panActive: boolean = false;
  public wheel: { forward: boolean, backward: boolean } = { forward: false, backward: false };

  public isKeyDown(key: string): boolean {
    return this.keydown[key];
  }

  public isKeyUp(key: string): boolean {
    return !this.keydown[key];
  }

}