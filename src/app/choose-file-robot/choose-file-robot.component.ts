import { Component, OnInit } from '@angular/core';
import { ChooseFileService } from '../_services/choose-file.service';
import { BrushService } from '../_services';

@Component({
  selector: 'app-choose-file-robot',
  templateUrl: './choose-file-robot.component.html',
  styleUrls: ['./choose-file-robot.component.scss']
})
export class ChooseFileRobotComponent implements OnInit {

  constructor(private fileChooser: ChooseFileService, private data: BrushService) { }

  // Class variables
  private navFiles: string[];
  private navDirectories: string[];
  private navUnknowns: string[];
  private baseURI: string;

  ngOnInit() {
    // Subscribe
    this.fileChooser.files.subscribe(navFiles => this.navFiles = navFiles);
    this.fileChooser.directories.subscribe(navDirectories => this.navDirectories = navDirectories);
    this.fileChooser.unknowns.subscribe(navUnknowns => this.navUnknowns = navUnknowns);
    this.fileChooser.baseURI.subscribe(baseURI => this.baseURI = baseURI);
  }

  // Remember to encode URI before creating link: encodeURI()
  httpGetAsync(theUrl: string, callback: Function) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open('GET', theUrl, true); // true for asynchronous
    xmlHttp.send(null);
  }

  httpRequestNoAuth() {
    this.httpGetAsync(this.baseURI + '?json=1', (response: any) => {
      this.fileChooser.parseResponse(response);
    });
  }

  parse(response: string) {
    const obj = JSON.parse(response);
    console.log(obj);
    const fileInfoArray = obj._embedded._state;
    const fsFiles: string[] = [];
    const fsDirs: string[] = [];
    const fsUnknowns: string[] = [];
    for (let i = 0; i < fileInfoArray.length; i++) {
      const element = fileInfoArray[i];
      const name = element._title;
      const ext = name.substr(name.length - 3).toLowerCase();

      if (element._type === 'fs-file' && ext === '.bt') { // Only accepted if type is file and extension is .bt
        fsFiles.push(name);
      } else if (element._type === 'fs-dir') {
        fsDirs.push(name);
      } else {
        fsUnknowns.push(name);
      }
    }

    // Update files, directories and unknowns in filechooser service
    this.fileChooser.changeFiles(fsFiles);
    this.fileChooser.changeDirectories(fsDirs);
    this.fileChooser.changeUnknowns(fsUnknowns);
  }

  fetchFile(URI: string) {
    fetch(URI)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        console.log(blob);
        const reader = new FileReader();
        reader.onload = () => {
            this.data.parseFile(reader.result.toString());
        };
        reader.readAsText(blob);
      }
    );
  }

  changeFile(fileName: string) {
    const URI = this.baseURI + encodeURI(fileName);
    console.log('Change file URI: ' + URI);
    this.fileChooser.fetchFile(URI);
  }

}
