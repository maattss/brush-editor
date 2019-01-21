import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { BrushService } from '../brush.service';
import { Brush, ChannelNames, GlobalVariables } from '../brush';

@Component({
  selector: 'app-brush-graph',
  templateUrl: './brush-graph.component.html',
  styleUrls: ['./brush-graph.component.scss']
})
export class BrushGraphComponent implements OnInit {

  constructor(private data: BrushService) { }

  // Local variables
  chNames: ChannelNames;
  brushes: Brush[];
  chart: [];
  initialized: boolean = false;
  globals: GlobalVariables; 

  ngOnInit() {
    this.data.changeGlobals({currentBrushId: 1});
    this.data.globals.subscribe(globalVars => {
      this.globals = globalVars;
      if(this.initialized === true) {
        this.addData();
      }
    });
    
    this.data.channelNames.subscribe(chNames => {
      this.chNames = chNames;
      if(this.initialized === true) {
        this.addData();
      }
    });
    this.data.currentBrush.subscribe(brushes => { 
      if(this.initialized === true) {
        this.addData();                               
      }    
      this.brushes = brushes;
      if(this.brushes.length > 0) {
        this.initialized = true;
      }
    });
  }

  // Chart variables
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
  public barChartLabels:string[] = ["No data"];
  public barChartData:any[] = [{
    data: 0,
    label: "No data"
  }];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  public isDataAvailable:boolean = false; // Controls if graph is displayed or not


  // Add/update labels to graph
  addLabels() {
    console.log("Adding labels");
    let channelAmount = this.returnAmountOfChannels();
    this.barChartLabels.length = 0;

    this.barChartLabels.push(
      this.chNames.ch1,
      this.chNames.ch2,
      this.chNames.ch3
    );
    if(channelAmount >= 4) {
      this.barChartLabels.push(this.chNames.ch4);
    }
    if(channelAmount == 5) {
      this.barChartLabels.push(this.chNames.ch5)
    }
  } 

  // Add/update data the graph 
  addData() {
    if (this.globals.currentBrushId > 0) {  // Do not draw garph if no brush is selected
      console.log("Adding data");
      this.addLabels();
      this.isDataAvailable = true;
      this.barChartData = [];
      let br: Brush = this.brushes[this.globals.currentBrushId - 1];
      let values: number[] = [br.ch1, br.ch2, br.ch3]
      if (br.ch4 >= 0) { values.push(br.ch4) };
      if (br.ch5 >= 0) { values.push(br.ch5) };
  
      this.barChartData.push({
        data: values,
        label: "BrushID: " + this.globals.currentBrushId
      });
  
      // For Angular to recognize the change in the dataset!
      let clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = values;
      clone[0].label = "BrushID " + this.globals.currentBrushId;
      this.barChartData = clone;
    } else {
      this.isDataAvailable = false;
    }
  }

  returnAmountOfChannels() {
    let totalChannels = 0;
    if(this.brushes[0].ch3>=0) { totalChannels = 3 };
    if(this.brushes[0].ch4>=0) { totalChannels = 4 };
    if(this.brushes[0].ch5>=0) { totalChannels = 5 };
    return totalChannels;
  }
}