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
  private currentUrlSrc   = new BehaviorSubject<string>('http://localhost/fileservice/$HOME/');
  private backEnabledSrc  = new BehaviorSubject<boolean>(false);

  // Http request values
  private url = 'http://localhost/fileservice/$home/';
  private userName = 'Default User';
  private password = 'robotics';

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
    this.changeCurrentUrl(this.url + url);
    this.url = this.url + encodeURI(url) + '/';
    this.backEnabledSrc.next(true);
  }
  moveBack() {
    const urlSplitted = this.url.split('/');

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

      this.url = newUrl;
      this.changeCurrentUrl(newUrl);
      this.httpGetWithDigest();
    }
  }

  httpGetWithDigest() {
    const digest = new digestAuthRequest('GET', this.url + '?json=1', this.userName, this.password);
    digest.request((response: any) => {
      console.log('API response: ', response);
      this.parseResponse(response);
    }, function(errorCode: any) {
      console.log('Error: ', errorCode);
    });
  }

  parseResponse(response: any) {
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
  fetchFile(fileName: string) {
    const fileUrl = this.url + encodeURI(fileName);
    fetch(fileUrl)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
            console.log(reader.result);
            this.data.parseFile(reader.result.toString());
        };
        console.log(blob);
        reader.readAsText(blob);
      }
    );
  }

  exportOpenFile() {
    console.log('Does not work yet..');
    // TODO: Not quite figured out the fileformat yet, also need to include errorhandling for unsuccessful uploads
    this.httpPostWithDigest();
    this.httpGetWithDigest();
  }

  httpPostWithDigest() {
    // const fileName = this.data.getFileName();
    // console.log(fileName);
    const fileName = 'test3.bt';
    const postData = this.data.getJSONdata();
    console.log(postData);
    const digest = new digestAuthRequest('PUT', this.url + fileName + '?json=1', this.userName, this.password);
    digest.request((response: any) => {
      console.log('API response: ', response);
      this.parseResponse(response);
    }, function(errorCode: any) {
      console.log('Error: ', errorCode);
    }, postData);
  }

  // // Old school regular XMLHttpRequest
  // httpGetAsync(theUrl: string, callback: Function) {
  //     const xmlHttp = new XMLHttpRequest();
  //     xmlHttp.onreadystatechange = function() {
  //         if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
  //           callback(xmlHttp.responseText);
  //         }
  //     };
  //     xmlHttp.open('GET', theUrl, true); // true for asynchronous
  //     xmlHttp.send(null);
  // }

  // httpRequestNoAuth() {
  //   this.httpGetAsync(this.currentUrl + '?json=1', (response: any) => {
  //     this.fileChooser.parseResponse(response);
  //   });
  // }
}
