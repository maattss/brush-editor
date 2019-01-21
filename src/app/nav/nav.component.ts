import { Component, OnInit, ViewChild } from '@angular/core';
import { Brush } from '../brush';
import { BrushTableComponent } from '../brush-table/brush-table.component';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private data: BrushService) { }

  ngOnInit() {

  }

  file: any;
  brushes: Brush[];

  fileChanged(e: any) { // Triggers when file input changes
    this.file = e.target.files[0]; 
    
    // Updates file name in file input label if neew file is read
    if (this.file.name) {
      (<HTMLLabelElement>document.getElementById("theFileLabel")).innerText = this.file.name;
    }
    
  }

  uploadFile(file: any) { // Triggers when file input changes
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
      if (description === undefined) { description = "" };

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
    this.data.changeBrush(this.brushes);
  }
}
