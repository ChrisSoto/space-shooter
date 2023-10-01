export class MathUtil {
  public static degToRad(d: number) {
    return d * Math.PI / 180;
  }

  public static RadToDeg(r: number) {
    return r * 180 / Math.PI;
  }
}