import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  /** Template reference to the canvas element */
  @ViewChild('canvasEl') canvasEl: ElementRef;

  startX = 0;
  startY = 0;
  mouseX = 0;
  mouseY = 0;
  bounds: DOMRect = null;
  existingLines = [];

  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;

  private isMouseActivated = false;

  get canvasElement(): HTMLCanvasElement {
    return this.canvasEl.nativeElement as HTMLCanvasElement;
  }

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.context = this.canvasElement.getContext('2d');
    this.bounds = this.canvasElement.getBoundingClientRect();
    //this.draw();
    this.drawImage();
  }

  mouseup(e) {
    if (e['button'] === 0) {
      if (this.isMouseActivated) {
        this.existingLines.push({
          startX: this.startX,
          startY: this.startY,
          endX: this.mouseX,
          endY: this.mouseY
        });

        this.isMouseActivated = false;
      }

      this.draw();
    }
  }

  mousedown(e) {
    if (e['button'] === 0) {
      if (!this.isMouseActivated) {
        this.startX = e['clientX'] - this.bounds.left;
        this.startY = e['clientY'] - this.bounds.top;
        this.isMouseActivated = true;
      }

      this.draw();
    }
  }

  mousemove(e) {
    this.mouseX = e.clientX - this.bounds.left;
    this.mouseY = e.clientY - this.bounds.top;

    if (this.isMouseActivated) {
      this.draw();
    }
  }

  private draw() {
    this.context.fillStyle = '#333333';
    this.context.fillRect(0, 0, canvasWidth, canvasHeight);
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 2;
    this.context.beginPath();

    for (var i = 0; i < this.existingLines.length; ++i) {
      var line = this.existingLines[i];
      this.context.moveTo(line.startX, line.startY);
      this.context.lineTo(line.endX, line.endY);
    }

    this.context.stroke();

    if (this.isMouseActivated) {
      this.context.strokeStyle = 'darkred';
      this.context.lineWidth = 3;
      this.context.beginPath();
      this.context.moveTo(this.startX, this.startY);
      this.context.lineTo(this.mouseX, this.mouseY);
      this.context.stroke();
    }
  }

  private drawImage() {
    let that = this;
    const image = new Image();
    image.src =
      'https://fwtx.com/downloads/7050/download/Yellow%20Building%20from%20Above.jpg.jpe?cb=16ba676f84fa45a37228db7e65f7257b&w=620&h=';
    image.onload = function() {
      that.context.drawImage(image, 0, 0);
    };
  }
}
