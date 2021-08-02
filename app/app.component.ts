import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { Shape } from './Shape';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasEl') canvasEl: ElementRef;

  canvasWidth = 400;
  canvasHeight = 400;
  startX = 0;
  startY = 0;
  mouseX = 0;//
  mouseY = 0;
  bounds: DOMRect = null;
  existingLines: Array<{startX: number, startY: number, endX: number, endY: number}> = [];
  shapes: Array<Shape> = [];

  private context: CanvasRenderingContext2D;
  private isInteractionActive = false;

  get canvasElement(): HTMLCanvasElement {
    return this.canvasEl.nativeElement as HTMLCanvasElement;
  }

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initCanvas();
  }

  initCanvas() {
    this.context = this.canvasElement.getContext('2d');
    this.bounds = this.canvasElement.getBoundingClientRect();
    this.canvasElement.style.width = '100%';
    this.canvasElement.style.height = '100%';
    this.canvasElement.width = this.canvasElement.offsetWidth;
    this.canvasElement.height = this.canvasElement.offsetHeight;
  }

  mouseup(e) {
    e.preventDefault();
    if ((e['button'] === 0 && this.isMouseClick(e)) || this.isTouch(e)) {
      if (this.isInteractionActive) {
        this.existingLines.push({
          startX: this.startX,
          startY: this.startY,
          endX: this.mouseX,
          endY: this.mouseY
        });
        this.isInteractionActive = false;
        this.resetCanvas();
        this.drawFromIntersectionPoints();
      }

      this.draw();
    }
  }

  mousedown(e) {
    e.preventDefault();
    if ((e['button'] === 0 && this.isMouseClick(e)) || this.isTouch(e)) {
      if (!this.isInteractionActive) {
        if (this.existingLines.length > 0) {
          this.startX = this.existingLines[this.existingLines.length - 1].endX;
          this.startY = this.existingLines[this.existingLines.length - 1].endY;
        } else {
          this.startX = this.isTouch(e) ? e['touches'][0]['clientX'] - this.bounds.left : e['clientX'] - this.bounds.left;
          this.startY = this.isTouch(e) ? e['touches'][0]['clientY'] - this.bounds.top : e['clientX'] - this.bounds.left;
        }
        this.isInteractionActive = true;
      }

      this.draw();
    }
  }

  mousemove(e) {
    e.preventDefault();
    let mousePos = this.isTouch(e) ? { x: e['touches'][0].clientX - this.bounds.left, y: e['touches'][0].clientY - this.bounds.top }:
      { x: e.clientX - this.bounds.left, y: e.clientY - this.bounds.top };
    if (this.existingLines.length > 0) {
      this.startX = this.existingLines[this.existingLines.length - 1].endX;
      this.startY = this.existingLines[this.existingLines.length - 1].endY;

      const xDiff = Math.hypot(mousePos.x - this.existingLines[0].startX);
      const yDiff = Math.hypot(mousePos.y - this.existingLines[0].startY);
      if (xDiff <= 20 && yDiff <= 20) {
        this.mouseX = this.existingLines[0].startX;
        this.mouseY = this.existingLines[0].startY;
      } else {
        this.mouseX = mousePos.x;
        this.mouseY = mousePos.y;
      }
    } else {
      this.mouseX = this.isTouch(e) ? e['touches'][0].clientX - this.bounds.left: e.clientX - this.bounds.left;
      this.mouseY = this.isTouch(e) ? e['touches'][0].clientY - this.bounds.top: e.clientY - this.bounds.top;
    }

    if (this.isInteractionActive) {
      this.draw();
    }
  }

  clearCanvas() {
    this.context.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    this.existingLines = [];
    this.shapes = [];
  }

  private drawShape() {
    let shape = new Shape();
    shape.setColor("blue"); // input from lib
    this.context.fillStyle = shape.color;
    this.context.beginPath();
    this.context.moveTo(this.existingLines[0].startX, this.existingLines[0].startY);
    shape.addPoints(this.existingLines[0].startX, this.existingLines[0].startY);
    for (let i = 0; i < this.existingLines.length; i++) {
      this.context.lineTo(this.existingLines[i].endX, this.existingLines[i].endY);
      if (i !== this.existingLines.length + 1) {
        shape.addPoints(this.existingLines[i].endX, this.existingLines[i].endY);
      }
      
    }
    this.context.closePath();
    this.context.fill();
    this.shapes.push(shape);
    this.existingLines = [];
  }

  private draw() {
    //this.context.fillStyle = 'transparent';
    this.context.lineWidth = 2;

    this.drawHistoryShapes();
    this.drawHistoryItems();

    if (this.isInteractionActive) {
      this.resetCanvas();
      this.context.strokeStyle = 'red'; // input from lib
      this.context.lineWidth = 2;
      this.context.lineJoin = 'round';
      this.context.beginPath();
      this.context.moveTo(this.startX, this.startY);
      this.context.lineTo(this.mouseX, this.mouseY);
      this.context.stroke();
    }
  }

  private drawHistoryShapes() {
    if (this.shapes.length > 0) {
      this.shapes.forEach(shape => {
        this.context.fillStyle = shape.color;
        this.context.beginPath();
        let points = shape.points;
        for (let i = 0; i < points.length; i++) {
          if (i == 0) {
            this.context.moveTo(points[i].x, points[i].y);
          }

          if (i !== 0 && i !== points.length - 1) {
            this.context.lineTo(points[i].x, points[i].y);
          }
        }// end of points
        this.context.closePath();
        this.context.fill();
      })
    }
  }

  private drawHistoryItems() {
    this.context.beginPath();
    this.context.strokeStyle = 'white'; // input from lib
    for (var i = 0; i < this.existingLines.length; ++i) {
      var line = this.existingLines[i];
      this.context.moveTo(line.startX, line.startY);
      this.context.lineTo(line.endX, line.endY);
    }

    this.context.stroke();
  }

  private isTouch(e) {
    return e['type'] === 'touchstart' || e['type'] === 'touchmove' || e['type'] === 'touchend';
  }

  private isMouseClick(e) {
    return e['type'] === 'mouseup' || e['type'] === 'mousemove' || e['type'] === 'mousedown';
  }

  private drawFromIntersectionPoints() {
    if (this.existingLines.length > 0) {
      if (this.existingLines[0].startX == this.existingLines[this.existingLines.length - 1].endX &&
        this.existingLines[0].startY == this.existingLines[this.existingLines.length - 1].endY) {
          this.drawShape();
        }
    }
  }

  private resetCanvas() {
    this.context.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    this.drawHistoryItems();
    this.drawHistoryShapes();
  }
}
