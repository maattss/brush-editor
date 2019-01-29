import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Brush, ChannelNames, GlobalVariables } from '../brush';

@Injectable({
  providedIn: 'root'
})
export class BrushService {
  private brushSource        = new BehaviorSubject<Array<Brush>>([]);
  private channelNamesSrc    = new BehaviorSubject<ChannelNames>
  ({ch1: 'Channel 1', ch2: 'Channel 2', ch3: 'Channel 3', ch4: 'Channel 4', ch5: 'Channel 5'});
  private globalsSrc         = new BehaviorSubject<GlobalVariables>({currentBrushId: 0});

  currentBrush   = this.brushSource.asObservable();
  channelNames   = this.channelNamesSrc.asObservable();
  globals        = this.globalsSrc.asObservable();

  constructor() { }

  changeBrush(brushes: Brush[]) {
    this.brushSource.next(brushes);
  }
  changeChannelName(chNames: ChannelNames) {
    this.channelNamesSrc.next(chNames);
  }
  changeGlobals(globalVars: GlobalVariables) {
    this.globalsSrc.next(globalVars);
  }
}
