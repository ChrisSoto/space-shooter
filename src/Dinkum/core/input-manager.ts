export class InputManager {

  private keydown: { [key: string]: boolean } = {};

  public initialize() {
    window.addEventListener("keydown", e => this.keydown[e.key] = true);
    window.addEventListener("keyup", e => this.keydown[e.key] = false);
  }

  public isKeyDown(key: string): boolean {
    return this.keydown[key];
  }

  public isKeyUp(key: string): boolean {
    return !this.keydown[key];
  }
}