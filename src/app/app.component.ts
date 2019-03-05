import { Component, OnInit } from '@angular/core';
import { Brush } from './brush';
import { BrushService, ViewService } from './_services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  constructor(private data: BrushService, private view: ViewService) { }

  // Class variables
  private brushes: Brush[];
  private showFileInfo: boolean;
  private showSettings: boolean;
  private showFileChooser: boolean;
  private showInfoMsg: boolean;

  ngOnInit() {
    // Subscribe
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    // this.view.infoMsg.subscribe(showInfoMsg => this.InfoMsg = showInfoMsg);
  }
}
