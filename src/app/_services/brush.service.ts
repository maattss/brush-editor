import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Brush, ChannelNames } from '../brush';
import { TestBed } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class BrushService {
  private brushSrc           = new BehaviorSubject<Array<Brush>>([]);
  private channelNamesSrc    = new BehaviorSubject<ChannelNames>
  ({ch1: 'Channel 1', ch2: 'Channel 2', ch3: 'Channel 3', ch4: 'Channel 4', ch5: 'Channel 5'});
  private currentBrushIdSrc  = new BehaviorSubject<number>(0);
  private fileCommentSrc     = new BehaviorSubject<string>('');
  private fileNameSrc        = new BehaviorSubject<string>('');
  private maxChannelValueSrc = new BehaviorSubject<number>(1000);

  currentBrush    = this.brushSrc.asObservable();
  channelNames    = this.channelNamesSrc.asObservable();
  fileComment     = this.fileCommentSrc.asObservable();
  fileName        = this.fileNameSrc.asObservable();
  currentBrushId  = this.currentBrushIdSrc.asObservable();
  maxChannelValue = this.maxChannelValueSrc.asObservable();

  constructor() { }

  changeBrush(brushes: Brush[]) {
    this.brushSrc.next(brushes);
  }
  changeChannelName(chNames: ChannelNames) {
    this.channelNamesSrc.next(chNames);
  }
  changeFileComment(comment: string) {
    this.fileCommentSrc.next(comment);
  }
  changeFileName(name: string) {
    this.fileNameSrc.next(name);
  }
  getFileName() {
    return this.fileNameSrc.value;
  }
  changeCurrentBrushID(id: number) {
    this.currentBrushIdSrc.next(id);
  }
  changeMaxChannelValue(value: number) {
    this.maxChannelValueSrc.next(value);
  }

  parseFile(text: string) {
    const brushes = [];

    // Handle JSON file format
    if (text.substring(0, 1) === '\"') {
      text = text.substring(1);
    }

    // Split read file by newline
    const list: string[] = text.split(/\r?\n/);
    let counter = 1;

    // Loop through brushes from file and push to brush-object
    list.forEach(element => {
      console.log('First line', element);
      // Handle file comment
      if (element.substring(0, 1) === '#') {
        const comment = element.substring(1).trim();
        console.log('comment', comment);
        this.changeFileComment(comment);
      } else {
        const channels: string[] = element.split(',');

        // Handle potential comments in brush file
        const lastCh = channels.length - 1;
        let description: string = channels[lastCh].split('#')[1];
        channels[lastCh] = channels[lastCh].split('#')[0];
        if (description === undefined) { description = ''; }

        // Add the correct amount of channels from file
        brushes.push({
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
    console.log('Parsed file', brushes);
    this.changeBrush(brushes);
  }

  getExportableString() {
   let text = '';
    if (this.fileCommentSrc.value) {  // Add comment to file if it exists
      text += '#' + this.fileCommentSrc.value + '\r\n';
    }

    let ch4Exists = false;
    let ch5Exists = false;
    // Check if channel 4 or channel 5 exists
    for (const brush of this.brushSrc.value) {
      if (brush.ch4) {
        ch4Exists = true;
      }
      if (brush.ch5) {
        ch5Exists = true;
      }
    }

    // Add brushes to file
    for (const brush of this.brushSrc.value) {
      text += brush.ch1 + ',' + brush.ch2 + ',' + brush.ch3;
      if (ch4Exists) {
        text += ',' + brush.ch4;
        if (ch5Exists) {
          text += ',' + brush.ch5;
        }
      }

      if (brush.desc !== '') {
        text += '#' + brush.desc;
      }
      if (!(brush.brushId >= this.brushSrc.value.length)) {
          text += '\r\n';
      }
    }
  return text;
  }

  // getDataAsCollection() {
  //   const collection = [];
  //   if (this.fileCommentSrc.value) {  // Add comment to file if it exists
  //     collection.push('#' + this.fileCommentSrc.value + '');
  //   }

  //   // Add brushes to file
  //   for (const brush of this.brushSrc.value) {
  //     let text = '';
  //     text += brush.ch1 + ',' + brush.ch2 + ',' + brush.ch3;
  //     if (brush.ch4) {
  //       text += ',' + brush.ch4;
  //     }
  //     if (brush.ch5) {
  //       text += ',' + brush.ch5;
  //     }
  //     if (brush.desc !== '') {
  //       text += '#' + brush.desc;
  //     }
  //     if (!(brush.brushId >= this.brushSrc.value.length)) {
  //         text += '';
  //     }
  //     collection.push(text);
  //   }
  //   return collection;
  // }

  // getExportableFile() {
  //   const text = this.getExportableString();
  //   const data = new Blob([text], {type: 'text/plain;charset=utf-8'});
  //   return data;
  // }
}
