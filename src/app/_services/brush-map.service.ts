import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BrushService } from './brush.service';

declare const digestAuthRequest: any;

@Injectable({
  providedIn: 'root'
})

export class BrushMap {
  private fileSrc = new BehaviorSubject<Array<string>>([]);
  private directorySrc = new BehaviorSubject<Array<string>>([]);
  private unknownSrc = new BehaviorSubject<Array<string>>([]);

  // Http request values
  private baseUrlSrc = new BehaviorSubject<string>('http://127.0.0.1/fileservice/$HOME/');
  private userName = 'Default User';
  private password = 'robotics';

  files = this.fileSrc.asObservable();
  directories = this.directorySrc.asObservable();
  unknowns = this.unknownSrc.asObservable();
  currentUrl = this.baseUrlSrc.asObservable();

  constructor(private data: BrushService) { }

  changeFiles(files: string[]) {
    this.fileSrc.next(files);
  }
  changeDirectories(directories: string[]) {
    this.directorySrc.next(directories);
  }
  changeUnknowns(unknowns: string[]) {
    this.unknownSrc.next(unknowns);
  }

  getFSResource() {
    this.getFSResourceUrl(this.baseUrlSrc.value);
  }

  getFSResourceUrl(url: string) {
    const digest = new digestAuthRequest('GET', url + '?json=1', this.userName, this.password);
    digest.request((response: any) => {
      this.parseFSResponse(response);
    }, function (errorCode: any) {
      console.log('Error: ', errorCode);
    });
  }

  parseFSResponse(response: any) {
    const fileInfoArray = response._embedded._state;
    const fsFiles: string[] = []; // File names
    const fsDirs: string[] = [];  // Directories
    const fsUnknowns: string[] = [];
    for (let i = 0; i < fileInfoArray.length; i++) {
      const element = fileInfoArray[i];
      const name = element._title;
      const ext = name.substr(name.length - 3).toLowerCase();

      if (element._type === 'fs-file' && ext === '.bt') { // File only accepted if type is file and extension is .bt
        fsFiles.push(name);
      } else if (element._type === 'fs-dir') {
        fsDirs.push(name);
      } else {
        fsUnknowns.push(name);
      }
    }

    // Sort and update
    fsFiles.sort();
    this.changeFiles(fsFiles);
    fsDirs.sort();
    this.changeDirectories(fsDirs);
    fsUnknowns.sort();
    this.changeUnknowns(fsUnknowns);
  }

  // Download and parse brush file from Robot Web Service API
  getFile() {
    this.getFileUrl(this.baseUrlSrc.value);
  }

  getFileUrl(fileName: string, url: string) {
    const digest = new digestAuthRequest('GET', url + encodeURI(fileName), this.userName, this.password);
    digest.request((response: any) => {
      this.data.parseFile(response.toString());
      console.log('GET response', response);
    }, function (errorCode: any) {
      console.log('Error: ', errorCode);
    });
  }

  exportOpenFile() {
    this.postFile(); // Export file
    this.getFSResource(); // get updated view for the file explorer
  }

  postFile() {
    const fileName = this.data.getFileName();
    const postData = this.data.getExportableString();

    const digest = new digestAuthRequest('PUT', this.currentUrlSrc.value + fileName, this.userName, this.password);
    digest.request((response: any) => {
      this.parseFSResponse(response);
    }, function (errorCode: any) {
      console.log('Error: ', errorCode);
    }, postData);
  }

  getPrograms() {

  }

  getMaterial() {

  }
}
