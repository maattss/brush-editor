import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { BrushService } from './brush.service';

@Injectable({
  providedIn: 'root'
})

export class ChooseFileService {
  private fileSrc      = new BehaviorSubject<Array<string>>([]);
  private directorySrc = new BehaviorSubject<Array<string>>([]);
  private unknownSrc   = new BehaviorSubject<Array<string>>([]);
  private baseURISrc   = new BehaviorSubject<string>('http://localhost:80/fileservice/$HOME/');

  files       = this.fileSrc.asObservable();
  directories = this.directorySrc.asObservable();
  unknowns    = this.unknownSrc.asObservable();
  baseURI     = this.baseURISrc.asObservable();

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
  changeBaseURI(URI: string) {
    this.baseURISrc.next(URI);
  }

  parseResponse(response: string) {
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
    this.changeFiles(fsFiles);
    this.changeDirectories(fsDirs);
    this.changeUnknowns(fsUnknowns);
  }

  fetchFile(url: string) {
    fetch(url)
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
}
