import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private showSettingsSrc = new BehaviorSubject<boolean>(false);
  private showFileInfoSrc = new BehaviorSubject<boolean>(false);

  showSettings = this.showSettingsSrc.asObservable();
  showFileInfo = this.showFileInfoSrc.asObservable();

  constructor() { }

  toggleSettingsView() {
    this.showSettingsSrc.next(!this.showSettingsSrc.value);
  }
  toggleFileInfoView() {
    this.showFileInfoSrc.next(!this.showFileInfoSrc.value);
  }
}
