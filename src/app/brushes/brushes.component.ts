import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';

@Component({
  selector: 'app-brushes',
  templateUrl: './brushes.component.html',
  styleUrls: ['./brushes.component.css']
})
export class BrushesComponent implements OnInit {
  brushes: Brush[] = [
    { 
      brushId: 1,
      ch1: 10,
      ch2: 20,
      ch3: 30,
      ch4: 40,
      ch5: 50,
      desc: "Tak"
    },
    {
      brushId: 2,
      ch1: 100,
      ch2: 200,
      ch3: 300,
      ch4: 400,
      ch5: 500,
      desc: "Bak"
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
