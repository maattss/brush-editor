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
    // Subscribe
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
  }

  fileChanged(event: any) { // Triggers when file input changes
    this.file = event.target.files[0];

    // Updates file name in file input label if neew file is read
    if (this.file) {
      (<HTMLLabelElement>document.getElementById('theFileLabel')).innerText = this.file.name;
    }

    // File reader
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.parseFile(fileReader.result.toString());
      this.data.changeGlobals({currentBrushId: 0});
    };

    // Prevents error in console when cancelling file upload
    try {
      fileReader.readAsText(this.file);
    } catch (error) {
      return;
    }

  }

  parseFile(text: string) {
    this.brushes = [];

    // Split read file by newline
    const list: string[] = text.split(/\r?\n/);
    let counter = 1;

    // Loop through brushes from file and push to brush-object
    list.forEach(element => {
      const channels: string[] = element.split(',');

      // Handle potential comments in brush file
      const lastCh = channels.length - 1;
      let description: string = channels[lastCh].split('#')[1];
      channels[lastCh] = channels[lastCh].split('#')[0];
      if (description === undefined) { description = ''; }

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
    let text = '';
    for (const brush of this.brushes) {
      text += (brush.ch1 + ',' + brush.ch2 + ',' + brush.ch3 + ',' + brush.ch4 + ',' + brush.ch5);
      if (brush.desc !== '') {
        text += '#' + brush.desc;
      }
      if (!(brush.brushId >= this.brushes.length)) {

      }
      text += ' \r\n';
    }
    const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    if (this.file.name !== '') {
      saveAs(blob, this.file.name);
    } else {
      saveAs(blob, 'default.bt');
    }

  }

  resetChannelNames() {
    const defaultNames = {ch1: 'Channel 1', ch2: 'Channel 2', ch3: 'Channel 3', ch4: 'Channel 4', ch5: 'Channel 5'};
    this.data.changeChannelName(defaultNames);
  }
}
