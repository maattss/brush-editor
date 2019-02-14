import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private showSettingsSrc = new BehaviorSubject<boolean>(true);
  private showFileInfoSrc = new BehaviorSubject<boolean>(true);

  showSettings = this.showSettingsSrc.asObservable();
  showFileInfo = this.showFileInfoSrc.asObservable();

  constructor() { }

  toggleSettingsView() {
    console.log('How/hide settings. Does not work yet:(');
  }
  toggleFileInfoView() {
    console.log('Show/hide file info. Does not work yet:(');
  }
}
