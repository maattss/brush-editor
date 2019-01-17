import { Component, OnInit, Input} from '@angular/core';
import { Brush } from '../brush';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-brush-table',
  templateUrl: './brush-table.component.html',
  styleUrls: ['./brush-table.component.scss']
})
export class BrushTableComponent implements OnInit {
  brushes: Brush[];
  constructor(private data: BrushService) { }
  currentBrushId: number = 1;

  ngOnInit() {
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
  }

  file: any;

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
    let totalChannels = this.returnAmountOfChannels();
    let channelString = "";
    this.barChartLabels.length = 0;

    for(var channel=1; channel<=totalChannels; channel++) {
      channelString = "Channel " + channel;
      this.barChartLabels.push(channelString);
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
    let totalChannels = 0;
    totalChannels = this.returnAmountOfChannels();

    // Clear color of all inactive rows
    for(var rowIndex=1; rowIndex<=this.brushes.length; rowIndex++) {
      for(var chIndex=1; chIndex<=totalChannels; chIndex++) {
        let chName = "ch" + chIndex;
        document.getElementById(rowIndex + chName).classList.remove("bg-success");
      }
      document.getElementById(rowIndex.toString()).classList.remove("bg-success");
      document.getElementById(rowIndex + "desc").classList.remove("bg-success");
    }

    // Setting color of the active row
    for(var chIndex=1; chIndex<=totalChannels; chIndex++) {
      let chName = "ch" + chIndex;
      document.getElementById(rowId + chName).classList.add("bg-success");
    }
    document.getElementById(rowId.toString()).classList.add("bg-success");
    document.getElementById(rowId + "desc").classList.add("bg-success");
  }
}
