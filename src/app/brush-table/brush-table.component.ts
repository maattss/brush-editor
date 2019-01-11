import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';

@Component({
  selector: 'app-brush-table',
  templateUrl: './brush-table.component.html',
  styleUrls: ['./brush-table.component.scss']
})
export class BrushTableComponent implements OnInit {
  file: any;
  brushes: Brush[];

  constructor() { }

  ngOnInit() {
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  uploadFile(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.parseFile(fileReader.result.toString());
    }
    fileReader.readAsText(this.file);
  }

  parseFile(text: string) {
    this.brushes = [];
    console.log(text); // Only for debug, remove
      
    // Split read file by newline
    let list: string[] = text.split(/\r?\n/);
    let counter: number = 1;
    
    // Loop trough brushes from file and push to brush-object
    list.forEach(element => {
      let channels: string[] = element.split(",");
      
      // Handle potential comments in brush file
      let description: string = channels[4].split("#")[1];
      channels[4] = channels[4].split("#")[0];
      if (description === undefined) {
        description = "";
      }

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
  }
}
