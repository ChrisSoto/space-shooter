import { Layer } from "../dinkum/graphics/layer";

export class Editor {
  layer: Layer;
  constructor() {
    this.layer = new Layer()
  }

  update(dt: number) {
    this.layer.fill('green')
  }

  draw() { }
}