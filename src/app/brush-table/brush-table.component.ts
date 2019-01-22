import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Brush, ChannelNames, GlobalVariables } from '../brush';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-brush-table',
  templateUrl: './brush-table.component.html',
  styleUrls: ['./brush-table.component.scss']
})

export class BrushTableComponent implements OnInit {
  constructor(private cookieService: CookieService, private data: BrushService) { }

   // Local variables
   brushes: Brush[];
   channelNames: ChannelNames;
   initialized: boolean = false;

  ngOnInit() {
    // Subscribe 
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    this.data.channelNames.subscribe(chNames => {
      this.channelNames = chNames;
      if(this.initialized == true) { // Page is fully initialized
        this.addChannelCookie();
      }
      this.initialized = true;
    });
    
    // Check if a cookie named chNames exist
    if (this.cookieService.check('chNames')) {
      console.log("We have a cookie with the value: " + this.cookieService.get('chNames'));
      this.channelNames = JSON.parse(this.cookieService.get('chNames')); 
    }
  }

  // Returns default channel names
  returnChannelDefaults() {
    let defaultNames = {ch1: "Channel 1", ch2: "Channel 2", ch3: "Channel 3", ch4: "Channel 4", ch5: "Channel 5"};
    return defaultNames;
  }

  // Checks the values of the input fields. Allows numbers and "."
  numberOnly(event: any, brushId: Number, channel: String): boolean {
    let inputValue = (<HTMLInputElement>document.getElementById(brushId.toString() + channel)).value;
    const charCode = (event.which) ? event.which : event.keyCode;

    if(inputValue.length<=0) {
      console.log("It is empty");
      (<HTMLInputElement>document.getElementById(brushId.toString() + channel)).value = "0";
    }

    for(var x=0; x<inputValue.length; x++) {
      if(inputValue.charAt(x) == "." && charCode == 46) {
        return false;
      }
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  markRow(rowId: number) {
    console.log("Marking row");
    this.data.changeGlobals({currentBrushId: rowId});
    this.data.changeChannelName(this.channelNames); 
    var colorClass = "table-danger";

    // Clear color of all inactive rows
    for(var rowIndex=1; rowIndex<=this.brushes.length; rowIndex++) {
      document.getElementById(rowIndex.toString()).classList.remove(colorClass);
    }

    // Setting color of the active row
    document.getElementById(rowId.toString()).classList.add(colorClass);
  }

  changeChannelValue(channelId: number) {
    let channelName = (<HTMLInputElement>document.getElementById("channelName" + channelId)).value;

    if(channelId==1) {
      this.channelNames.ch1 = channelName;
    } else if(channelId==2) {
      this.channelNames.ch2 = channelName;
    } else if(channelId==3) {
      this.channelNames.ch3 = channelName;
    } else if(channelId==4) {
      this.channelNames.ch4 = channelName;
    } else if(channelId==5) { 
      this.channelNames.ch5 = channelName;
    }
    this.data.changeChannelName(this.channelNames);
  }

  // Add/customize a cookie containing users channelnames
  addChannelCookie() {
    var json_channelNames = JSON.stringify(this.channelNames);
    this.cookieService.set('chNames', json_channelNames, 365); // Expires after 1 year
  }

  updateBrushes(brushId: number, channel: string) {
    let elementId = "" + brushId + channel;
    let val = (<HTMLInputElement>document.getElementById(elementId)).value

    var brush = this.brushes[brushId-1];
    if (channel === "ch1") {
      brush.ch1 = +val; // + parses string to number
    } else if (channel === "ch2") {
      brush.ch2 = +val;
    } else if (channel === "ch3") {
      brush.ch3 = +val;
    } else if (channel === "ch4") {
      brush.ch4 = +val;
    } else if (channel === "ch5") {
      brush.ch5 = +val;
    } else {  // channel === "desc"
      brush.desc = val;
    }
    this.data.changeBrush(this.brushes);
  }

  // If the user wants to reset his channel-name changes
  resetChannelValues() {
    let defaultVals = this.returnChannelDefaults();
    this.channelNames = defaultVals;
    this.data.changeChannelName(this.channelNames);
  }
}