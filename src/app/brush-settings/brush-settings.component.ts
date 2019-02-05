import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';
import { BrushService } from '../_services/index';

@Component({
  selector: 'app-brush-settings',
  templateUrl: './brush-settings.component.html',
  styleUrls: ['./brush-settings.component.scss']
})
export class BrushSettingsComponent implements OnInit {

  constructor(private data: BrushService) { }

   // Class variables
   private brushes: Brush[];

  ngOnInit() {
    // Subscribe
    this.data.currentBrush.subscribe(brushes => {
      this.brushes = brushes;
    });
  }

}
