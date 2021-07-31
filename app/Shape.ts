import { Point } from "./Point";

export class Shape {

  private _points: Array<Point> = [];
  private _color: "blue" | "white" | "yellow";

  get points(): Array<Point> { return this._points; }
  get color(): "blue" | "white" | "yellow" { return this._color; }

  constructor() {}

  addPoints(x, y) {
    this._points.push(new Point(x, y));
  }

  setColor(color: "blue" | "white" | "yellow") {
    this._color = color;
  }
}