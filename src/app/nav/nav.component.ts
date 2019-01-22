import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';
import { BrushService } from '../brush.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private data: BrushService) { }

  // Local variables
  brushes: Brush[];
  file: any;

  ngOnInit() {
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
  }

  fileChanged(e: any) { // Triggers when file input changes
    this.file = e.target.files[0]; 
    
    // Updates file name in file input label if neew file is read
    if (this.file) {
      (<HTMLLabelElement>document.getElementById("theFileLabel")).innerText = this.file.name;
    }
    
  }

  uploadFile(file: any) { // Triggers when file input changes
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.parseFile(fileReader.result.toString());
      this.data.changeGlobals({currentBrushId: 0})
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

  saveFileAs() {
    var text:string = "";
    for(let brush of this.brushes) {
      text += (brush.ch1 + ","+ brush.ch2 + "," + brush.ch3 + "," + brush.ch4 + "," + brush.ch5);
      if (brush.desc != "") {
        text += "#" + brush.desc;
      }
      text += " \r\n"
    }
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    if (this.file.name != "") {
      saveAs(blob, this.file.name);
    } else {
      saveAs(blob, "default.bt");
    }
  }

  resetChannelNames() {
    let defaultNames = {ch1: "Channel 1", ch2: "Channel 2", ch3: "Channel 3", ch4: "Channel 4", ch5: "Channel 5"};
    this.data.changeChannelName(defaultNames); 
  }
}
