export class Point {

  constructor(x?: number, y?: number) {
    if (x && y) {
      this.x = x;
      this.y = y;
    }
  }

  private _x: number;
  get x(): number { return this._x;}
  set x(value: number) {this._x = value; }

  private _y: number;
  get y(): number { return this._y; }
  set y(value: number) { this._y = value; }
}