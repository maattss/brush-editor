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
  constructor(private cookieService: CookieService, private data: BrushService,
              private pagerService: PagerService) { }

  // Class variables
  private brushes: Brush[];
  private channelNames: ChannelNames;
  private initialized = false;
  private currentBrushId: number;

  // Keep track of current page
  private currentPage = 1;

  // pager object
  private pager: any = {};

  // paged items
  private pagedItems: Brush[];

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

    this.data.currentBrushId.subscribe(brushId => this.currentBrushId = brushId);

    // Check if a cookie named chNames exist
    if (this.cookieService.check('chNames')) {
      console.log('We have a cookie with the value: ' + this.cookieService.get('chNames'));
      this.channelNames = JSON.parse(this.cookieService.get('chNames'));
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
    this.data.changeChannelName(this.channelNames);
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
      console.log(inputValue);
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
