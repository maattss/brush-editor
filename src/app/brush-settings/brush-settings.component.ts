import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';
import { BrushService, ViewService } from '../_services/index';

@Component({
  selector: 'app-brush-settings',
  templateUrl: './brush-settings.component.html',
  styleUrls: ['./brush-settings.component.scss']
})
export class BrushSettingsComponent implements OnInit {

  constructor(private data: BrushService, private view: ViewService) { }

   // Class variables
   private brushes: Brush[];
   private showSettings: boolean;

  ngOnInit() {
    // Subscriptions
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    this.view.showSettings.subscribe(showSettings => this.showSettings = showSettings);
  }
  updateSettings() {
    console.log('Settings updated');
  }

  resetSettings() {
    this.resetChannelNames();
  }

  resetChannelNames() {
    const defaultNames = {ch1: 'Channel 1', ch2: 'Channel 2', ch3: 'Channel 3', ch4: 'Channel 4', ch5: 'Channel 5'};
    this.data.changeChannelName(defaultNames);
  }

  toggleSettings() {
    this.view.toggleSettingsView();
  }
}
