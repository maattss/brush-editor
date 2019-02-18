import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Brush, ChannelNames, GlobalVariables } from '../brush';
import { PagerService, BrushService } from '../_services/index';

@Component({
  selector: 'app-brush-table',
  templateUrl: './brush-table.component.html',
  styleUrls: ['./brush-table.component.scss']
})

export class BrushTableComponent implements OnInit {

  // Class variables
  private brushes: Brush[];
  private channelNames: ChannelNames;
  private initialized = false;
  private currentBrushId: number;
  private maxChannelValue: number;
  private inputError = false;

  // Keep track of current page
  private currentPage = 1;

  // pager object
  private pager: any = {};

  // paged items
  private pagedItems: Brush[];

  constructor(
    private cookieService: CookieService,
    private data: BrushService,
    private pagerService: PagerService) { }

  ngOnInit() {
    // Subscribe
    this.data.currentBrush.subscribe(brushes => {
      this.brushes = brushes;

      if (this.initialized === true) { // Page is fully initialized
        // Initialize to page 1
        this.setPage(this.currentPage);
      }
    });

    this.data.channelNames.subscribe(chNames => {
      this.channelNames = chNames;
      if (this.initialized === true) { // Page is fully initialized
        this.addChannelCookie();
      }
      this.initialized = true;
    });

    // Do NOT subscribe to currentBrushId => Creates infinite loop!
    // this.data.currentBrushId.subscribe(brushId => this.currentBrushId = brushId);
    this.data.maxChannelValue.subscribe(maxChannelValue => this.maxChannelValue = maxChannelValue);

    // Check if a cookie named chNames exist
    if (this.cookieService.check('chNames')) {
      console.log('We have a cookie with the value: ' + this.cookieService.get('chNames'));
      this.channelNames = JSON.parse(this.cookieService.get('chNames'));
    }
  }

  private inputValidation(brushId: number): void {
    this.inputError = true;
    if (this.brushes[brushId - 1].ch1 > this.maxChannelValue) {
      while (this.brushes[brushId - 1].ch1 > this.maxChannelValue) { // In case user holds button
        this.brushes[brushId - 1].ch1 = Math.floor(this.brushes[brushId - 1].ch1 / 10);
      }
    } else if (this.brushes[brushId - 1].ch2 > this.maxChannelValue) {
      while (this.brushes[brushId - 1].ch2 > this.maxChannelValue) {
        this.brushes[brushId - 1].ch2 = Math.floor(this.brushes[brushId - 1].ch2 / 10);
      }
    } else if (this.brushes[brushId - 1].ch3 > this.maxChannelValue) {
      while (this.brushes[brushId - 1].ch3 > this.maxChannelValue) {
        this.brushes[brushId - 1].ch3 = Math.floor(this.brushes[brushId - 1].ch3 / 10);
      }
    } else if (this.brushes[brushId - 1].ch4 > this.maxChannelValue) {
      while (this.brushes[brushId - 1].ch4 > this.maxChannelValue) {
        this.brushes[brushId - 1].ch4 = Math.floor(this.brushes[brushId - 1].ch4 / 10);
      }
    } else if (this.brushes[brushId - 1].ch5 > this.maxChannelValue) {
      while (this.brushes[brushId - 1].ch5 > this.maxChannelValue) {
        this.brushes[brushId - 1].ch5 = Math.floor(this.brushes[brushId - 1].ch5 / 10);
      }
    } else {
      this.inputError = false;
    }
  }

  setPage(page: number) {
    this.currentPage = page;
    // get pager object from service
    this.pager = this.pagerService.getPager(this.brushes.length, page);

    // get current page of items
    this.pagedItems = this.brushes.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  markRow(rowId: number) {
    this.data.changeCurrentBrushID(rowId);
    const colorClass = 'table-danger';

    let index = 10 * (this.currentPage - 1) + 1; // Current first row index
    const indexEnd = index + this.pagedItems.length - 1; // Last index for current page

    // Clear color of all inactive rows
    for (index; index <= indexEnd; index++) {
      document.getElementById(index.toString()).classList.remove(colorClass);
    }

    // Setting color of the active row
    document.getElementById(rowId.toString()).classList.add(colorClass);
  }

  changeChannelValue(channelId: number) {
    const channelName = (<HTMLInputElement>document.getElementById('channelName' + channelId)).value;

    if (channelId === 1) {
      this.channelNames.ch1 = channelName;
    } else if (channelId === 2) {
      this.channelNames.ch2 = channelName;
    } else if (channelId === 3) {
      this.channelNames.ch3 = channelName;
    } else if (channelId === 4) {
      this.channelNames.ch4 = channelName;
    } else if (channelId === 5) {
      this.channelNames.ch5 = channelName;
    }
    this.data.changeChannelName(this.channelNames);
  }

  // Add/customize a cookie containing users channelnames
  addChannelCookie() {
    const json_channelNames = JSON.stringify(this.channelNames);
    this.cookieService.set('chNames', json_channelNames, 365); // Expires after 1 year
  }

  updateBrushes(brushId: number, channel: string) {
    const elementId = '' + brushId + channel;
    const inputValue = (<HTMLInputElement>document.getElementById(elementId)).value;

    const brush = this.brushes[brushId - 1];
    if (channel === 'ch1') {
      brush.ch1 = +inputValue; // + parses string to number
    } else if (channel === 'ch2') {
      brush.ch2 = +inputValue;
    } else if (channel === 'ch3') {
      brush.ch3 = +inputValue;
    } else if (channel === 'ch4') {
      brush.ch4 = +inputValue;
    } else if (channel === 'ch5') {
      brush.ch5 = +inputValue;
    } else {  // channel === "desc"
      brush.desc = inputValue;
    }
    console.log(this.brushes[0].ch1);
    this.data.changeBrush(this.brushes);
  }

  deleteRow(brushId: number) {
    const brush = this.brushes[brushId - 1];
    brush.ch1 = 0;
    brush.ch2 = 0;
    brush.ch3 = 0;
    brush.ch4 = 0;
    brush.ch5 = 0;
    brush.desc = '';
    this.data.changeBrush(this.brushes);
  }
}
