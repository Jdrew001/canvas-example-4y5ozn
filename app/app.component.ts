import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  /** Template reference to the canvas element */
  @ViewChild('canvasEl') canvasEl: ElementRef;

  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;

  constructor() {}

  ngAfterViewInit() {
    this.context = (this.canvasEl
      .nativeElement as HTMLCanvasElement).getContext('2d');

    //this.draw();
    this.drawImage();
  }

  /**
   * Draws something using the context we obtained earlier on
   */
  private draw() {
    this.context.font = '30px Arial';
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';

    const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
    const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;
    this.context.fillText('@realappie', x, y);
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
