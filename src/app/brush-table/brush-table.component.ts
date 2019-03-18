import { Component, OnInit, SkipSelf } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Brush, ChannelNames, GlobalVariables } from '../brush';
import { PagerService, BrushService, ViewService } from '../_services/index';

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
  private maxChannelValue: number;
  private currentBrushId: number; // Need this when moving to a page where the active row is

  // Pagination
  private currentPage = 1;
  private pager: any = {};
  private pagedItems: Brush[];

  // Input validation
  private inputError = false;

  constructor(
    private cookieService: CookieService,
    private data: BrushService,
    private view: ViewService,
    private pagerService: PagerService) { }

  ngOnInit() {
    this.data.currentBrush.subscribe(brushes => {
      this.brushes = brushes;

      if (this.initialized === true) { // Page is fully initialized
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

    this.data.maxChannelValue.subscribe(maxChannelValue => this.maxChannelValue = maxChannelValue);

    // Check if a cookie named chNames exist
    if (this.cookieService.check('chNames')) {
      this.data.changeChannelName(JSON.parse(this.cookieService.get('chNames')));
    }

    // Check if a cookie named maxChannelValue exist
    if (this.cookieService.check('maxChannelValue')) {
      const cookieVal = JSON.parse(this.cookieService.get('maxChannelValue'));
      this.data.changeMaxChannelValue(cookieVal);
    }
  }

  private inputValidation(brushId: number, channel): boolean {
    const brush = this.brushes[brushId - 1];
    for (const channelX in brush) { // Loops through channel names in current brush object
      if (channelX.toString() === channel) {
        if (brush[channelX] > this.maxChannelValue) { this.inputError = true; }
        while (brush[channelX] > this.maxChannelValue) { // Reduce by 10 until demand is met
          brush[channelX] = Math.floor(brush[channelX] / 10);
          if (brush[channelX] <= this.maxChannelValue) {
            return;
          }
        }
      }
    }
    this.data.changeBrush(this.brushes);
    this.inputError = false;
  }

  setPage(page: number) {
    this.currentPage = page;
    // get pager object from service
    this.pager = this.pagerService.getPager(this.brushes.length, page);

    // get current page of items
    this.pagedItems = this.brushes.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  markRow(rowId: number) {
    this.currentBrushId = rowId;
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
    const newChannelName = (<HTMLInputElement>document.getElementById('channelName' + channelId)).value;

    for (const oldName in this.channelNames) {
      if (oldName === ('ch' + channelId.toString())) {
        this.channelNames[oldName] = newChannelName;
      }
    }
    this.data.changeChannelName(this.channelNames);
  }

  // Add/customize a cookie containing users channelnames
  addChannelCookie() {
    const jsonChannelNames = JSON.stringify(this.channelNames);
    this.cookieService.set('chNames', jsonChannelNames, 365); // Expires after 1 year
  }

  updateBrushes(brushId: number, channel: string) {
    const elementId = '' + brushId + channel;
    const inputValue = (<HTMLInputElement>document.getElementById(elementId)).value;
    const brush = this.brushes[brushId - 1];

    for (const channelX in brush) { // Loops through channel names in brush
      if (channelX.toString() === channel) {
        if (channel === 'desc') {
          brush[channelX] = inputValue;
        } else { // ch1, ch2, ch3, ch4 or ch5
          brush[channelX] = +inputValue;
        }
      }
    }
  }

  deleteRow(brushId: number) {
    const brush = this.brushes[brushId - 1];
    console.log(brush);
    for (const obj in brush) { // Loops through channel names in brush
      if (obj.toString() === 'desc') {
        brush[obj] = '';
      } else if (obj.toString() !== 'brushId') {
        if (!isNaN(+brush[obj])) {
          brush[obj] = 0;
        } else {
          console.log('Gotcha');
        }
      }
    }
    this.data.changeBrush(this.brushes);
  }

  isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}
