export class InputManager {

  public keydown: { [key: string]: boolean } = {};
  public mouseDown: boolean = false;
  public mouse: number[] = []
  public wheel: { forward: boolean, backward: boolean } = { forward: false, backward: false };
  public transformActive: boolean = false;

  public initialize(canvas: HTMLCanvasElement) {
    window.addEventListener("keydown", e => this.keydown[e.key] = true);
    window.addEventListener("keyup", e => this.keydown[e.key] = false);
    canvas.addEventListener("wheel", e => {
      this.getMousePosition(e, canvas)
    })
    canvas.addEventListener("mousedown", e => {
      canvas.addEventListener("mousemove", e => {
        this.getMousePosition(e, canvas)
        this.mouseDown = true;
      })
    })
  }

  public isKeyDown(key: string): boolean {
    return this.keydown[key];
  }

  public isKeyUp(key: string): boolean {
    return !this.keydown[key];
  }

  private getMousePosition(event: WheelEvent | MouseEvent, canvas: HTMLCanvasElement) {
    event.preventDefault()
    if (event.button == 0) {
      this.mouseDown = true;
    } else {
      this.mouseDown = false;
    }

    const rect = canvas.getBoundingClientRect();
    const cssX = event.clientX - rect.left;
    const cssY = event.clientY - rect.top;

    const widthRatio = canvas.width / canvas.clientWidth;
    const heightRatio = canvas.height / canvas.clientHeight;
    this.mouse = [cssX * widthRatio, cssY * heightRatio];
  }
}