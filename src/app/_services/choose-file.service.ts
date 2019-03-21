import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { BrushService } from './brush.service';

declare const digestAuthRequest: any;

@Injectable({
  providedIn: 'root'
})

export class ChooseFileService {
  private fileSrc         = new BehaviorSubject<Array<string>>([]);
  private directorySrc    = new BehaviorSubject<Array<string>>([]);
  private unknownSrc      = new BehaviorSubject<Array<string>>([]);
  private backEnabledSrc  = new BehaviorSubject<boolean>(false);

  // Http request values
  private currentUrlSrc   = new BehaviorSubject<string>('http://127.0.0.1/fileservice/$HOME/');
  private userName        = 'Default User';
  private password        = 'robotics';

  files       = this.fileSrc.asObservable();
  directories = this.directorySrc.asObservable();
  unknowns    = this.unknownSrc.asObservable();
  currentUrl  = this.currentUrlSrc.asObservable();
  backEnabled = this.backEnabledSrc.asObservable();

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
    const digest = new digestAuthRequest('GET', this.currentUrlSrc.value + '?json=1', this.userName, this.password);
    digest.request((response: any) => {
      this.parseFSResponse(response);
    }, function(errorCode: any) {
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
    }, function(errorCode: any) {
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

    // Try something like this. https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    // const str = this.data.getExportableString();
    // const utf8 = unescape(encodeURIComponent(str));
    // const arr = [];
    // for (let i = 0; i < utf8.length; i++) {
    //   arr.push(utf8.charCodeAt(i));
    // }

    const digest = new digestAuthRequest('PUT', this.currentUrlSrc.value + fileName, this.userName, this.password);
    digest.request((response: any) => {
      this.parseFSResponse(response);
    }, function(errorCode: any) {
      console.log('Error: ', errorCode);
    }, postData);
  }
}
