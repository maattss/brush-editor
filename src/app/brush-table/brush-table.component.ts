import { Component, OnInit, Input} from '@angular/core';
import { Brush } from '../brush';
import { ChannelNames } from '../brush';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-brush-table',
  templateUrl: './brush-table.component.html',
  styleUrls: ['./brush-table.component.scss']
})
export class BrushTableComponent implements OnInit {
  brushes: Brush[];

  channelNames: ChannelNames = {ch1: "Channel 1", ch2: "Channel 2", ch3: "Channel 3", ch4: "Channel 4", ch5: "Channel 5"};

  constructor(private data: BrushService) { }
  currentBrushId: number = 1;

  ngOnInit() {
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
  }

  file: any;

  // Returns default channel names
  returnChannelDefaults() {
    let defaultNames = {ch1: "Channel 1", ch2: "Channel 2", ch3: "Channel 3", ch4: "Channel 4", ch5: "Channel 5"};
    return defaultNames;
  }

  // Chart
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  public barChartLabels:string[] = [];
  public barChartData:any[] = [];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  // Checks the values of the input fields. Allows numbers and "."
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  // Add labels to graph
  addLabels() {
    let channelAmount = this.returnAmountOfChannels();
    this.barChartLabels.length = 0;

    this.barChartLabels.push(
      this.channelNames.ch1,
      this.channelNames.ch2,
      this.channelNames.ch3
    );
    if(channelAmount >= 4) {
      this.barChartLabels.push(this.channelNames.ch4);
    }
    if(channelAmount == 5) {
      this.barChartLabels.push(this.channelNames.ch5)
    }
  } 

  // Add data to graph
  addData(brushID: number) {
    this.addLabels();
    this.barChartData = [];
    let br: Brush = this.brushes[brushID - 1];
    let values: number[] = [br.ch1, br.ch2, br.ch3]
    if (br.ch4 >= 0) {
      values.push(br.ch4);
    }
    if (br.ch5 >= 0) {
      values.push(br.ch5);
    }

    this.barChartData.push({
      data: values,
      label: "BrushID: " + brushID 
    });

    // For Angular to recognize the change in the dataset!
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = values;
    clone[0].label = "BrushID " + brushID;
    this.barChartData = clone;
    
  }

  returnAmountOfChannels() {
    let totalChannels = 0;
    if(this.brushes[0].ch3>=0) { 
      totalChannels = 3;
    }
    if(this.brushes[0].ch4>=0) {
      totalChannels = 4;
    }
    if(this.brushes[0].ch5>=0) {
      totalChannels = 5;
    }
    return totalChannels;
  }

  markRow(rowId: number) {
    this.currentBrushId = rowId;

    // Clear color of all inactive rows
    for(var rowIndex=1; rowIndex<=this.brushes.length; rowIndex++) {
      document.getElementById(rowIndex.toString()).classList.remove("bg-success");
    }

    // Setting color of the active row
    document.getElementById(rowId.toString()).classList.add("bg-success");
  }

  changeChannelValue(channelId) {
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
  }

  // If the user wants to reset his channel-name changes
  resetChannelValues() {
    let defaultVals = this.returnChannelDefaults();
    this.channelNames = defaultVals;
  }
}
