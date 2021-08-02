import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KonvaModule } from 'ng2-konva';

import { AppComponent } from './app.component';

@NgModule({
  imports:      [ BrowserModule, KonvaModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
