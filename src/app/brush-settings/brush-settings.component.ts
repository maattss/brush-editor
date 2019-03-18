import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';
import { BrushService, ViewService } from '../_services/index';
import { CookieService } from 'ngx-cookie-service';
import { ChooseFileService } from '../_services/choose-file.service';

@Component({
  selector: 'app-brush-settings',
  templateUrl: './brush-settings.component.html',
  styleUrls: ['./brush-settings.component.scss']
})
export class BrushSettingsComponent implements OnInit {

  constructor(private fileChooser: ChooseFileService, private data: BrushService, 
    private view: ViewService, private cookieService: CookieService) { }

  // Class variables
  private brushes: Brush[];
  private maxChannelValue: number;
  private initialized: boolean;
  private url: string;
  private robotIP: string;

  ngOnInit() {
    // Subscriptions
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    this.fileChooser.currentUrl.subscribe(url => this.url = url);
    this.data.maxChannelValue.subscribe(maxChannelValue => {
      this.maxChannelValue = maxChannelValue;
      if (this.initialized) {
        this.addChannelCookie();
      }
      this.initialized = true;
    });

    // Strip the IP from the url
    let robotStripArr = [];
    robotStripArr = this.url.split('/').map(String);
    this.robotIP = robotStripArr[2]; // This is the robotIP stripped from the url
  }

  updateMaxChannelValue() {
    const maxChannelValueNew = +(<HTMLInputElement>document.getElementById('maxChannelvalue')).value;
    if (maxChannelValueNew >= 0) {
      this.data.changeMaxChannelValue(maxChannelValueNew);
      this.addChannelCookie();
      document.getElementById('confirmation').hidden = false;
    } else {
      this.view.showInfoError('Your max channel value must be greater than 0!');
    }
  }

  updateRobotIP() {
    const newRobotIP = (<HTMLInputElement>document.getElementById('robotIP')).value;
    if (this.validateIPaddress(newRobotIP) === true) { // Valid address
      this.robotIP = newRobotIP;
      this.fileChooser.changeCurrentUrl('http://' + newRobotIP + '/fileservice/$HOME/');
      this.toggleSettings();
      this.view.showInfoSuccess('You updated Robot IP successfully!');
    } else { // Not a valid address
      this.view.showInfoError('Your robot IP address is not valid!');
    }
  }

  setRobotIPtoLocal() {
    this.fileChooser.changeCurrentUrl('http://127.0.0.1/fileservice/$HOME/');
    this.toggleSettings();
    this.view.showInfoSuccess('You updated Robot IP successfully!');
  }

  resetMaxChannel() {
    document.getElementById('allSettings').hidden = true;
    this.data.changeMaxChannelValue(1000);
    this.addChannelCookie();
    document.getElementById('confirmation').hidden = false;
  }

  resetChannelNames() {
    const defaultNames = {ch1: 'Channel 1', ch2: 'Channel 2', ch3: 'Channel 3', ch4: 'Channel 4', ch5: 'Channel 5'};
    this.data.changeChannelName(defaultNames);
    this.toggleSettings();
    this.view.showInfoSuccess('You set channel names back to default successfully!');
  }

  validateIPaddress(ipaddress) {
    // tslint:disable-next-line:max-line-length
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return true;
    }
    return false;
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
    this.view.showInfoSuccess('All values greater than ' + this.maxChannelValue
    + ' are changed to ' + this.maxChannelValue + '!');
    this.toggleSettings();
  }

  toggleSettings() {
    this.view.toggleSettingsView();
  }

  hideConfirmation() {
    document.getElementById('confirmation').hidden = true;
  }

  hideSettingsDiv() {
    document.getElementById('allSettings').hidden = true;
  }

  addChannelCookie() {
    const jsonMaxChannelValue = JSON.stringify(this.maxChannelValue);
    this.cookieService.set('maxChannelValue', jsonMaxChannelValue, 365); // Expires after 1 year
  }
}
