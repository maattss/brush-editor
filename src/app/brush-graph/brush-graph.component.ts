import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { BrushService } from '../_services/index';
import { Brush, ChannelNames, GlobalVariables } from '../brush';

@Component({
  selector: 'app-brush-graph',
  templateUrl: './brush-graph.component.html',
  styleUrls: ['./brush-graph.component.scss']
})
export class BrushGraphComponent implements OnInit {

  // Chart variables
  public barChartOptions = {
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
  public barChartLabels: string[] = ['No data'];
  public barChartData: any[] = [{
    data: 0,
    label: 'No data'
  }];
  public barChartType = 'bar';
  public barChartLegend = true;
  public isDataAvailable = false; // Controls if graph is displayed or not

  constructor(private data: BrushService) { }

  // Local variables
  chNames: ChannelNames;
  brushes: Brush[];
  chart: [];
  initialized = false;
  globals: GlobalVariables;

  ngOnInit() {
    this.data.globals.subscribe(globalVars => {
      this.globals = globalVars;
      if (this.initialized === true) {
        this.addData();
        console.log('Current brush ID updated to: ' + globalVars.currentBrushId);
      }
    });

    this.data.channelNames.subscribe(chNames => {
      this.chNames = chNames;
      if (this.initialized === true) {
        this.addData();
        console.log('Channel names updated');
      }
    });
    this.data.currentBrush.subscribe(brushes => {
      if (this.initialized === true) {
        this.addData();
        console.log('brushes updated');
      }
      this.brushes = brushes;
      if (this.brushes.length > 0) {
        this.initialized = true;
      }
    });
  }

  // Add/update labels to graph
  addLabels() {
    console.log('Adding labels');
    const channelAmount = this.returnAmountOfChannels();
    this.barChartLabels.length = 0;

    this.barChartLabels.push(
      this.chNames.ch1,
      this.chNames.ch2,
      this.chNames.ch3
    );
    if (channelAmount >= 4) {
      this.barChartLabels.push(this.chNames.ch4);
    }
    if (channelAmount === 5) {
      this.barChartLabels.push(this.chNames.ch5);
    }
  }

  // Add/update data the graph
  addData() {
    if (this.globals.currentBrushId > 0) {  // Do not draw graph if no brush is selected
      console.log('Adding data');
      this.addLabels();
      this.isDataAvailable = true;
      this.barChartData = [];
      const br: Brush = this.brushes[this.globals.currentBrushId - 1];
      const values: number[] = [br.ch1, br.ch2, br.ch3];
      if (br.ch4 >= 0) { values.push(br.ch4); }
      if (br.ch5 >= 0) { values.push(br.ch5); }

      this.barChartData.push({
        data: values,
        label: 'BrushID: ' + this.globals.currentBrushId
      });

      // For Angular to recognize the change in the dataset!
      const clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = values;
      clone[0].label = 'BrushID ' + this.globals.currentBrushId;
      this.barChartData = clone;
    } else {
      this.isDataAvailable = false;
    }
  }

  returnAmountOfChannels() {
    let totalChannels = 0;
    if (this.brushes[0].ch3 >= 0) { totalChannels = 3; }
    if (this.brushes[0].ch4 >= 0) { totalChannels = 4; }
    if (this.brushes[0].ch5 >= 0) { totalChannels = 5; }
    return totalChannels;
  }
}
