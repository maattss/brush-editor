import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Brush, ChannelNames, ChannelMaxValues } from '../brush';
import { TestBed } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class BrushService {
  private brushSrc            = new BehaviorSubject<Array<Brush>>([]);
  private channelNamesSrc     = new BehaviorSubject<ChannelNames>
  ({ch1: 'Atom', ch2: 'Fluid', ch3: 'Shape 1', ch4: 'Shape 2', ch5: 'High volt'});
  private channelMaxValuesSrc = new BehaviorSubject<ChannelMaxValues>
  ({ch1: 1000, ch2: 1000, ch3: 1000, ch4: 1000, ch5: 1000});
  private currentBrushIdSrc   = new BehaviorSubject<number>(0);
  private fileCommentSrc      = new BehaviorSubject<string>('');
  private fileNameSrc         = new BehaviorSubject<string>('');

  currentBrush     = this.brushSrc.asObservable();
  channelNames     = this.channelNamesSrc.asObservable();
  channelMaxValues = this.channelMaxValuesSrc.asObservable();
  fileComment      = this.fileCommentSrc.asObservable();
  fileName         = this.fileNameSrc.asObservable();
  currentBrushId   = this.currentBrushIdSrc.asObservable();

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
  updateChannelMaxValue(channelMaxValuesNew: ChannelMaxValues) {
    this.channelMaxValuesSrc.next(channelMaxValuesNew);
  }

  parseFile(text: string) {
    if (text === '') {
      this.changeBrush([]);
      return;
    }

    const brushes = [];

    const list: string[] = text.split(/\r?\n/);
    let counter = 1;

    // Loop through brushes from file and push to brush-object
    list.forEach(element => {
      // Handle file comment
      if (element.substring(0, 1) === '#') {
        const comment = element.substring(1).trim();
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
}
