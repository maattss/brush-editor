import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { BrushService } from '../brush.service';
import { Brush } from '../brush';

@Component({
  selector: 'app-brush-graph',
  templateUrl: './brush-graph.component.html',
  styleUrls: ['./brush-graph.component.scss']
})
export class BrushGraphComponent implements OnChanges, OnInit {

  constructor(private data: BrushService) { }
  @Input() currentBrushId: number;

  brushes: Brush[];
  chart: [];
  initialized: boolean = false;

  ngOnInit() {
      this.data.currentBrush.subscribe(brushes => { 
      this.brushes = brushes;
      this.addLabels();
      this.initialized = true;
    });
    console.log(this.brushes);
  }

  ngOnChanges() {
    console.log(this.initialized);
    if(this.initialized === true) {
      this.addData(this.currentBrushId);
      console.log(this.currentBrushId);
    }
   
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
  public barChartData:any[] = [
  {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

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
    this.barChartData = [];
    let br: Brush = this.brushes[brushID - 1];
    let values: number[] = [br.ch1, br.ch2, br.ch3]
    if (br.ch4 >= 0) {
      values.push(br.ch4);
    }
    if (br.ch5 >= 0) {
      values.push(br.ch5);
    }

    console.log(this.barChartData);
    // this.barChartData.push({
    //   data: values,
    //   label: "BrushID: " + brushID 
    // });


    // For Angular to recognize the change in the dataset!
    // let clone = JSON.parse(JSON.stringify(this.barChartData));
    // clone[0].data = values;
    // clone[0].label = "BrushID " + brushID;
    // this.barChartData = clone;
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
}
