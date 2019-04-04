import { Component, OnInit } from '@angular/core';
import { Brush, ChannelMaxValues, ChannelNames } from '../brush';
import { BrushService, ViewService } from '../_services/index';
import { CookieService } from 'ngx-cookie-service';
import { ChooseFileService } from '../_services/choose-file.service';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

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
  private channelNames: ChannelNames;
  private channelMaxValues: ChannelMaxValues;
  private currentUserChannel: string; // Users channel names
  private currentChannel: string; // Stock channel names
  private currentChannelMaxValue: number;
  private initialized: boolean;
  private url: string;
  private robotIP: string;

  ngOnInit() {
    // Subscriptions
    this.data.channelNames.subscribe(chNames => {
      this.channelNames = chNames;
    });
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    this.fileChooser.currentUrl.subscribe(url => this.url = url);
    this.data.channelMaxValues.subscribe(channelMaxValues => {
      this.channelMaxValues = channelMaxValues;
      if (this.initialized) { this.addMaxChannelValuesCookie(); }
      this.initialized = true;
    });

    // Get the IP from the url
    let robotStripArr = [];
    robotStripArr = this.url.split('/').map(String);
    this.robotIP = robotStripArr[2]; // This is the robotIP stripped from the url
  }

  addChoices() { // When user has chosen a channel
    console.log('Addchoices');
    document.getElementById('channelMaxValue').hidden = false;
    document.getElementById('updateMaxBtn').hidden = false;
    document.getElementById('resetMaxBtn').hidden = false;
    const channelElement        = <HTMLSelectElement>document.getElementById('channelChosen');
    this.updateCurrentUserChannel(channelElement.options[channelElement.selectedIndex].text);
    this.updateCurrentChannel(channelElement.options[channelElement.selectedIndex].value);
  }

  showMaxValue() { // Display max value for chosen channel
    console.log('Showmaxvalue');
    for (const obj in this.channelMaxValues) {
      if (obj.toString() === this.currentChannel.toString()) {
        console.log('New maxchannelval: ' + this.channelMaxValues[obj]);
        this.currentChannelMaxValue = this.channelMaxValues[obj];
      }
    }
  }

  updateMaxChannelValue() {
    const channelElement        = <HTMLSelectElement>document.getElementById('channelChosen');
    const channelMaxValueNew    = +(<HTMLInputElement>document.getElementById('channelMaxValue')).value;
    const channelName           = channelElement.options[channelElement.selectedIndex].value;

    this.updateCurrentChannelMaxValue(channelMaxValueNew);

    if (channelMaxValueNew >= 0) {
      for (const channelX in this.channelMaxValues) {
        if (channelX.toString() === channelName.toString()) {
          this.channelMaxValues[channelX] = channelMaxValueNew;
        }
      }
      this.data.updateChannelMaxValue(this.channelMaxValues);
      this.addMaxChannelValuesCookie();
      this.showConfirmationSingleChannel();
    } else {
      this.view.showInfoError('Your max channel value must be greater than 0!');
    }
  }

  updateRobotIP() {
    const newRobotIP = (<HTMLInputElement>document.getElementById('robotIP')).value;
    if (this.validateIPaddress(newRobotIP) === true) { // Valid address
      this.robotIP = newRobotIP;
      // Update current and home folder URL
      this.fileChooser.changeCurrentUrl('http://' + newRobotIP + '/fileservice/$HOME/');
      this.fileChooser.changeHomeUrl('http://' + newRobotIP + '/fileservice/$HOME/');
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

  resetChannelMaxValues() {
    this.channelMaxValues = {ch1: 1000, ch2: 1000, ch3: 1000, ch4: 1000, ch5: 1000};
    this.data.updateChannelMaxValue(this.channelMaxValues);
    this.addMaxChannelValuesCookie();
    this.showConfirmationAllChannels(); // Because all channels are changed
  }

  resetChannelNames() {
    const defaultNames = {ch1: 'Atom', ch2: 'Fluid', ch3: 'Shape 1', ch4: 'Shape 2', ch5: 'High volt'};
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

  adjustChannelsToMaxvalue() {
    const channelElement        = <HTMLSelectElement>document.getElementById('channelChosen');
    const channelName           = channelElement.options[channelElement.selectedIndex].value;

    for (let brushId = 1; brushId <= this.brushes.length; brushId++) {
      const brush = this.brushes[brushId - 1];
      // Loops through channel names in current brush object
      for (const obj in brush) {
        // Updates only users chosen channel
        if (brush[obj] === brush[channelName] && brush[obj] > this.channelMaxValues[obj]) {
          brush[obj] = this.channelMaxValues[obj];
        }
      }
    }
    this.data.changeBrush(this.brushes);
    this.hideConfirmationSingleChannel();
    this.toggleSettings();
    this.view.showInfoSuccess('You successfully updated the table!');
  }

  updateCurrentUserChannel(newUserChannel) { // User specified channel: Atom, fluid, etc.
    this.currentUserChannel = newUserChannel;
  }

  updateCurrentChannel(newStockChannel) { // Only stock channels: ch1, ch2, ch3, ch4, ch5
    this.currentChannel = newStockChannel;
  }

  updateCurrentChannelMaxValue(newChannelMaxValue) {
    this.currentChannelMaxValue = newChannelMaxValue;
  }

  toggleSettings() {
    this.view.toggleSettingsView();
  }

  hideConfirmationSingleChannel() {
    document.getElementById('confirmationSingleChannel').hidden = true;
  }

  showConfirmationSingleChannel() { // User decides if he wants to update values for single channel
    document.getElementById('confirmationSingleChannel').hidden = false;
  }

  hideConfirmationAllChannels() {
    document.getElementById('confirmationAllChannels').hidden = true;
  }

  showConfirmationAllChannels() { // User decides if he wants to update values for all channels
    document.getElementById('confirmationAllChannels').hidden = false;
  }

  hideSettingsDiv() {
    document.getElementById('allSettings').hidden = true;
  }

  addMaxChannelValuesCookie() {
    const jsonChannelMaxValues = JSON.stringify(this.channelMaxValues);
    this.cookieService.set('channelMaxValues', jsonChannelMaxValues, 365); // Expires after 1 year
  }
}
