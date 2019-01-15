import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';
import { Identifiers } from '@angular/compiler';
//import { OnlyNumber } from '../onlynumber.directive';

@Component({
  selector: 'app-brush-table',
  templateUrl: './brush-table.component.html',
  styleUrls: ['./brush-table.component.scss']
})
export class BrushTableComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

  file: any;
  brushes: Brush[];

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

  fileChanged(e: any) {
    this.file = e.target.files[0];
  }

  uploadFile(file: any) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.parseFile(fileReader.result.toString());
    }
    fileReader.readAsText(this.file);
  }

  parseFile(text: string) {
    this.brushes = [];
      
    // Split read file by newline
    let list: string[] = text.split(/\r?\n/);
    let counter: number = 1;
    
    // Loop through brushes from file and push to brush-object
    list.forEach(element => {
      let channels: string[] = element.split(",");
      
      // Handle potential comments in brush file
      let lastCh = channels.length-1;
      let description: string = channels[lastCh].split("#")[1];
      channels[lastCh] = channels[lastCh].split("#")[0];
      if (description === undefined) {
        description = "";
      }

      // Add the correct amount of channels from file
      this.brushes.push({
          brushId: counter,
          ch1: +channels[0],
          ch2: +channels[1],
          ch3: +channels[2],
          ch4: +channels[3],
          ch5: +channels[4],
          desc: description
        });
      
      counter++;
    });
    this.addLabels();
    this.addData(1);
  }

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
    this.barChartLabels.length = 0;
    if (this.brushes != []) {
      this.barChartLabels.push("Channel 1", "Channel 2", "Channel 3");
      
      if(this.brushes[0].ch4 >=0) {
        this.barChartLabels.push("Channel 4");
      }
      if(this.brushes[0].ch5 >=0) {
        this.barChartLabels.push("Channel 5");
      }
    }
  }

  // Add data to graph
  addData(brushID: number) {
    let activeRow = document.getElementById("1");
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
    if(this.brushes[1].ch3>=0) {
      totalChannels = 3;
    }
    if(this.brushes[1].ch4>=0) {
      totalChannels = 4;
    }
    if(this.brushes[1].ch5>=0) {
      totalChannels = 5;
    }
    return totalChannels;
  }

  markRow(rowId) {
    let totalChannels = 0;
    totalChannels = this.returnAmountOfChannels();  
    console.log(totalChannels);

    // Clear color of all inactive rows
    for(var rowIndex=1; rowIndex<this.brushes.length; rowIndex++) {
      for(var chIndex=1; chIndex<=totalChannels; chIndex++) {
        let chName = "ch" + chIndex;
        document.getElementById(rowIndex + chName).classList.remove("bg-success");
      }
      document.getElementById(rowIndex.toString()).classList.remove("bg-success");
      document.getElementById(rowIndex + "desc").classList.remove("bg-success");
    }

    // Setting color of the active row
    for(var x=1; x<=totalChannels; x++) {
      let chName = "ch" + x;
      document.getElementById(rowId + chName).classList.add("bg-success");
    }
    document.getElementById(rowId).classList.add("bg-success");
    document.getElementById(rowId + "desc").classList.add("bg-success");
  }
}
