import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Brush, ChannelNames, GlobalVariables } from '../brush';

@Injectable({
  providedIn: 'root'
})
export class BrushService {
  private brushSrc           = new BehaviorSubject<Array<Brush>>([]);
  private channelNamesSrc    = new BehaviorSubject<ChannelNames>
  ({ch1: 'Channel 1', ch2: 'Channel 2', ch3: 'Channel 3', ch4: 'Channel 4', ch5: 'Channel 5'});
  private currentBrushIdSrc  = new BehaviorSubject<number>(0);
  private fileCommentSrc     = new BehaviorSubject<string>('');
  private fileNameSrc     = new BehaviorSubject<string>('');

  currentBrush   = this.brushSrc.asObservable();
  channelNames   = this.channelNamesSrc.asObservable();
  fileComment    = this.fileCommentSrc.asObservable();
  fileName       = this.fileNameSrc.asObservable();
  currentBrushId = this.currentBrushIdSrc.asObservable();

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
}
