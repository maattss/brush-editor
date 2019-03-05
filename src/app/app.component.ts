import { Component, OnInit } from '@angular/core';
import { Brush } from './brush';
import { BrushService, ViewService } from './_services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  constructor(private data: BrushService) { }

  // Class variables
  private brushes: Brush[];

  ngOnInit() {
    // Subscribe
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
  }
}
