import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BrushService } from './brush.service';

declare const digestAuthRequest: any;

@Injectable({
  providedIn: 'root'
})

export class ChooseFileService {
  private fileSrc = new BehaviorSubject<Array<string>>([]);
  private directorySrc = new BehaviorSubject<Array<string>>([]);
  private unknownSrc = new BehaviorSubject<Array<string>>([]);
  private brushDeviceSrc = new BehaviorSubject<Array<string>>([]);
  private programSrc = new BehaviorSubject<Map<number, string>>(new Map());
  private materialSrc = new BehaviorSubject<Map<number, string>>(new Map());
  private backEnabledSrc = new BehaviorSubject<boolean>(false);

  // Http request values
  private currentUrlSrc = new BehaviorSubject<string>('http://127.0.0.1/fileservice/$HOME/');
  private homeUrlSrc = new BehaviorSubject<string>('http://127.0.0.1/fileservice/$HOME/');
  private userName = 'Default User';
  private password = 'robotics';

  files = this.fileSrc.asObservable();
  directories = this.directorySrc.asObservable();
  unknowns = this.unknownSrc.asObservable();
  currentUrl = this.currentUrlSrc.asObservable();
  backEnabled = this.backEnabledSrc.asObservable();
  brushDevice = this.brushDeviceSrc.asObservable();
  program = this.programSrc.asObservable();
  material = this.materialSrc.asObservable();

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
  changeCurrentUrl(url: string) {
    this.currentUrlSrc.next(url);
  }
  changeHomeUrl(url: string) {
    this.homeUrlSrc.next(url);
  }
  addToUrl(url: string) {
    this.changeCurrentUrl(this.currentUrlSrc.value + encodeURI(url) + '/');
    this.backEnabledSrc.next(true);
  }
  moveBack() {
    const urlSplitted = this.currentUrlSrc.value.split('/');

    if (urlSplitted[urlSplitted.length - 2] !== '$home') {
      let newUrl = '';
      let newFolder = '';
      for (let i = 0; i < urlSplitted.length - 2; i++) {
        newUrl += urlSplitted[i] + '/';
        newFolder = urlSplitted[i];
      }

      if (newFolder.toLowerCase() === '$home') {
        this.backEnabledSrc.next(false);
      }

      this.changeCurrentUrl(newUrl);
      this.getFSResource();
    }
  }

  getFSResource() {
    this.getFSResourceUrl(this.currentUrlSrc.value);
  }

  getFSResourceUrl(url: string) {
    const digest = new digestAuthRequest('GET', this.currentUrlSrc.value + '?json=1', this.userName, this.password);
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
  getFile(fileName: string) {
    const digest = new digestAuthRequest('GET', this.currentUrlSrc.value + encodeURI(fileName), this.userName, this.password);
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

  fetchAll() {
    this.fetchBrushDevices();
    this.fetchPrograms();
    this.fetchMaterials();
  }

  fetchPrograms() {
    const digest = new digestAuthRequest('GET', this.homeUrlSrc.value + 'alias/program.map?json=1', this.userName, this.password);
    digest.request((response: any) => {
      // TODO: Add programs to map here
      console.log(response);
    }, function (errorCode: any) {
      console.log('Error: ', errorCode);
    });
  }

  fetchMaterials() {
    const digest = new digestAuthRequest('GET', this.homeUrlSrc.value + 'alias/material.map?json=1', this.userName, this.password);
    digest.request((response: any) => {
      // TODO: Add materials to map here
      console.log(response);
    }, function (errorCode: any) {
      console.log('Error: ', errorCode);
    });

  }

  fetchBrushDevices() {
    const digest = new digestAuthRequest('GET', this.homeUrlSrc.value + '?json=1', this.userName, this.password);
    digest.request((response: any) => {
      const fileInfoArray = response._embedded._state;
      const fsDirs: string[] = [];  // Directories
      for (let i = 0; i < fileInfoArray.length; i++) {
        const element = fileInfoArray[i];
        const name = element._title;

        if (element._type === 'fs-dir') {
          fsDirs.push(name);
        }
      }

      fsDirs.sort();
      this.brushDeviceSrc.next(fsDirs);

    }, function (errorCode: any) {
      console.log('Error: ', errorCode);
    });
  }

  private getFileName(program: string, material: string) {
    let programNumber = 0;
    // Loop through program map and find programNumber
    console.log('Programs\n');
    this.programSrc.value.forEach((name: string, num: number) => {
      console.log('Name:' + name, ', Number:' + num);
      if (name === program) {
        programNumber = num;
      }
    });
    let materialNumber = 0;
    // Loop through material map and find materialNumber
    console.log('Materials\n');
    this.materialSrc.value.forEach((name: string, num: number) => {
      console.log('Name:' + name, ', Number:' + num);
      if (name === material) {
        materialNumber = num;
      }
    });
    // Using P*100 + M as mapping function
    return 'Table' + programNumber * 100 + materialNumber + '.bt';
  }

  getFileFromMapping(program: string, material: string, brushDevice: string) {
    const fileName = this.getFileName(program, material);
    const digest = new digestAuthRequest('GET', this.homeUrlSrc.value + brushDevice + fileName + '?json=1', this.userName, this.password);
    digest.request((response: any) => {
      this.data.parseFile(response.toString());
      console.log(response);
    }, function (errorCode: any) {
      console.log('Error: ', errorCode);
    });
  }
}
