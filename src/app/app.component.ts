import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Brush editor';
  brush = {
    brushId: 1,
    ch1: 10,
    ch2: 0,
    ch3: 200,
    ch4: 200, 
    ch5: 100,
    desc: "Støtfanger"
  }
  brush2 = {
    brushId: 2,
    ch1: 50,
    ch2: 20,
    ch3: 100,
    ch4: 500,
    ch5: 75,
    desc: "Tak"
  }
  allBrushes = [this.brush, this.brush2]
}
