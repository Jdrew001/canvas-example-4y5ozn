import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Shape } from './Shape';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  configStage: Observable<any> = of({
    width: 200,
    height: 200
  });

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    
  }
}
