import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Brush, ChannelNames } from '../brush';

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
  changeCurrentBrushID(id: number) {
    this.currentBrushIdSrc.next(id);
  }
  changeMaxChannelValue(value: number) {
    this.maxChannelValueSrc.next(value);
  }

  parseFile(text: string) {
    const brushes = [];

    // Split read file by newline
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
}
