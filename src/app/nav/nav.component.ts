import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';
import { BrushService, ViewService } from '../_services/index';
import { saveAs } from 'file-saver';
import { parseHttpResponse } from 'selenium-webdriver/http';

declare const myTest: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private data: BrushService, private view: ViewService) { }

  // Class variables
  private brushes: Brush[];
  private file: any;
  private fileComment: string;
  private fileName: string;

  ngOnInit() {
    // Subscribe
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    this.data.fileComment.subscribe(fileComment => this.fileComment = fileComment);
    this.data.fileName.subscribe(fileName => this.fileName = fileName);
  }

  toggleFileInfo() {
    this.view.toggleFileInfoView();
  }

  toggleSettings() {
    this.view.toggleSettingsView();
  }

  fileChanged(event: any) { // Triggers when file input changes
    this.file = event.target.files[0];

    // Updates file name if new file is read
    if (this.file) {
      this.data.changeFileName(this.file.name);
    }

    // File reader
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.parseFile(fileReader.result.toString());
      this.data.changeCurrentBrushID(0);
    };

    // Prevents error in console when cancelling file upload
    try {
      fileReader.readAsText(this.file);
    } catch (error) {
      return;
    }
  }

  myTestClick() {
    console.log(myTest());
  }

  parseFile(text: string) {
    this.brushes = [];

    // Split read file by newline
    const list: string[] = text.split(/\r?\n/);
    let counter = 1;

    // Loop through brushes from file and push to brush-object
    list.forEach(element => {
      // Handle file comment
      if (element.substring(0, 1) === '#') {
        const comment = element.substring(1).trim();
        this.data.changeFileComment(comment);
      } else {
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
      }
    });
    this.data.changeBrush(this.brushes);
  }

  saveFileAs() {
    let text = '';
    if (this.fileComment) {  // Add comment to file if it exists
      text += '#' + this.fileComment + ' \r\n';
    }

    // Add brushes to file
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
      saveAs(blob, this.fileName);
    } else {
      saveAs(blob, 'default.bt');
    }

  }
/*
  httpRequestLocal() {
    const url = 'http://127.0.0.1';
    const digest = new digestAuthRequest('GET', url, 'Default User', 'robotics');
    console.log(digest);
  }
*/
  httpRequest() {
    // Http request
    const url = 'http://127.0.0.1';

    // Create HTTP request object
    const digest = require('digest-auth-request');
    console.log(digest);

    // create digest request object
    console.log(digest());
    const getRequest = digest();
    // console.log(getRequest);

    // Make the request
    getRequest.request(function(datax) {
      console.log('Data retrieved successfully');
      console.log(datax);
      document.getElementById('result').innerHTML = 'Data retrieved successfully';
      document.getElementById('data').innerHTML = JSON.stringify(datax);
    }, function(errorCode) {
      console.log('no dice: ' + errorCode);
      document.getElementById('result').innerHTML = 'Error: ' + errorCode;
    });
  }
  httpRequestNoDigest() {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          // callback(xmlHttp.responseText);
          console.log(xmlHttp.responseText);
          parseResponse(xmlHttp.responseText);
        }
    };
    xmlHttp.open('GET', 'http://localhost:80/fileservice/$HOME?json=1', true); // true for asynchronous
    xmlHttp.send(null);
  }
  parseResponse(response: string) {

  }
}
