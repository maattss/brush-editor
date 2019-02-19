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
   private showSettings: boolean;
   private maxChannelValue: number;
   private initialized: boolean;

  ngOnInit() {
    // Subscriptions
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    this.view.showSettings.subscribe(showSettings => this.showSettings = showSettings);
    this.data.maxChannelValue.subscribe(maxChannelValue => {
      this.maxChannelValue = maxChannelValue;
      if (this.initialized) {
        this.addChannelCookie();
      }
      this.initialized = true;
    });

     // Check if a cookie named maxChannelValue exist
     if (this.cookieService.check('maxChannelValue')) {
      console.log('Max channel value cookie: ' + this.cookieService.get('maxChannelValue'));
      this.data.changeMaxChannelValue(JSON.parse(this.cookieService.get('maxChannelValue')));
    }
  }
  updateSettings() {
    const inputValue = (<HTMLInputElement>document.getElementById('maxChannelvalue')).value;
    this.data.changeMaxChannelValue(+inputValue);
    this.addChannelCookie();
    this.view.toggleSettingsView();
  }

  resetSettings() {
    this.resetChannelNames();
    this.data.changeMaxChannelValue(1000);
    this.view.toggleSettingsView();
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
