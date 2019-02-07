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
   fileComment =  'tests';

  ngOnInit() {
    // Subscribe
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    this.data.fileComment.subscribe(fileComment => {
      this.fileComment = fileComment;
      if (fileComment !== '' || null) {
        console.log(fileComment);
      }
    });
  }

  resetChannelNames() {
    console.log('Channel names reset');
    const defaultNames = {ch1: 'Channel 1', ch2: 'Channel 2', ch3: 'Channel 3', ch4: 'Channel 4', ch5: 'Channel 5'};
    this.data.changeChannelName(defaultNames);
  }

}
