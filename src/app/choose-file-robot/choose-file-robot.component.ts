import { Component, OnInit } from '@angular/core';
import { ChooseFileService } from '../_services/choose-file.service';
import { BrushService, ViewService } from '../_services';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-choose-file-robot',
  templateUrl: './choose-file-robot.component.html',
  styleUrls: ['./choose-file-robot.component.scss']
})
export class ChooseFileRobotComponent implements OnInit {

  constructor(private fileChooser: ChooseFileService, private data: BrushService, private view: ViewService) { }

  // Class variables
  private navFiles: string[];
  private navDirectories: string[];
  private navUnknowns: string[];
  private baseURI: string;
  private showFileChooser: boolean;

  ngOnInit() {
    // Subscribe
    this.fileChooser.files.subscribe(navFiles => this.navFiles = navFiles);
    this.fileChooser.directories.subscribe(navDirectories => this.navDirectories = navDirectories);
    this.fileChooser.unknowns.subscribe(navUnknowns => this.navUnknowns = navUnknowns);
    this.fileChooser.baseURI.subscribe(baseURI => this.baseURI = baseURI);
    this.view.showFileChooser.subscribe(showFileChooser => this.showFileChooser = showFileChooser);
  }

  toggleFileChooser() {
    this.view.toggleFileChooserView();
  }

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

  openFileChooser() {
    this.httpRequestNoAuth();
    this.view.toggleFileChooserView();
  }

  changeFile(fileName: string) {
    this.data.changeFileName(fileName);
    const URI = this.baseURI + encodeURI(fileName);
    console.log('Change file URI: ' + URI);
    this.fileChooser.fetchFile(URI);
  }

  changeDirectory(dirName: string) {
    console.log('Not yet implemented ');
  }
}
