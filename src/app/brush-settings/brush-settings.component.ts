import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';
import { BrushService, ViewService } from '../_services/index';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-brush-settings',
  templateUrl: './brush-settings.component.html',
  styleUrls: ['./brush-settings.component.scss']
})
export class BrushSettingsComponent implements OnInit {

  constructor(private data: BrushService, private view: ViewService, private cookieService: CookieService) { }

  // Class variables
  private brushes: Brush[];
  private maxChannelValue: number;
  private initialized: boolean;

  ngOnInit() {
    // Subscriptions
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    this.data.maxChannelValue.subscribe(maxChannelValue => {
      this.maxChannelValue = maxChannelValue;
      if (this.initialized) {
        this.addChannelCookie();
      }
      this.initialized = true;
    });
  }
  updateSettings() {
    const maxChannelValueNew = +(<HTMLInputElement>document.getElementById('maxChannelvalue')).value;
    this.data.changeMaxChannelValue(maxChannelValueNew);
    this.addChannelCookie();
    document.getElementById('allSettings').hidden = true;
    document.getElementById('confirmation').hidden = false;
    // this.view.toggleSettingsView();
    // this.view.showInfoSuccess('Settings updated successfully!');
  }

  hideConfirmation() {
    document.getElementById('confirmation').hidden = true;
    this.view.toggleSettingsView();
    this.view.showInfoSuccess('Settings updated successfully!');
  }

  adjustBrushToMaxvalue() {
    for (let brushId = 1; brushId <= this.brushes.length; brushId++) {
      const brush = this.brushes[brushId - 1];
      for (const channel in brush) { // Loops through channel names in current brush object
        if (brush[channel] > this.maxChannelValue && brush[channel] > this.maxChannelValue) {
          brush[channel] = this.maxChannelValue;
        }
      }
    }
    this.data.changeBrush(this.brushes);
    this.hideConfirmation();
  }

  resetSettings() {
    this.resetChannelNames();
    this.data.changeMaxChannelValue(1000);
    this.view.toggleSettingsView();
    this.view.showInfoSuccess('Settings reset successfully!');
  }

  resetChannelNames() {
    const defaultNames = {ch1: 'Channel 1', ch2: 'Channel 2', ch3: 'Channel 3', ch4: 'Channel 4', ch5: 'Channel 5'};
    this.data.changeChannelName(defaultNames);
  }

  toggleSettings() {
    this.view.toggleSettingsView();
  }

  addChannelCookie() {
    const jsonMaxChannelValue = JSON.stringify(this.maxChannelValue);
    this.cookieService.set('maxChannelValue', jsonMaxChannelValue, 365); // Expires after 1 year
  }
}
