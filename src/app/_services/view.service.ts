import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private showSettingsSrc = new BehaviorSubject<boolean>(false);
  private showFileInfoSrc = new BehaviorSubject<boolean>(false);
  private showFileChooserSrc = new BehaviorSubject<boolean>(false);
  private successMsg: string;
  private errorMsg: string;
  private infoMsgSrc = new BehaviorSubject<string>('');
  private showSuccessSrc = new BehaviorSubject<boolean>(false);
  private showErrorSrc = new BehaviorSubject<boolean>(false);

  showSettings = this.showSettingsSrc.asObservable();
  showFileInfo = this.showFileInfoSrc.asObservable();
  showFileChooser = this.showFileChooserSrc.asObservable();
  infoMsg = this.infoMsgSrc.asObservable();
  showSuccess = this.showSuccessSrc.asObservable();
  showError = this.showErrorSrc.asObservable();

  constructor() { }

  toggleSettingsView() {
    this.showSettingsSrc.next(!this.showSettingsSrc.value);
  }
  toggleFileInfoView() {
    this.showFileInfoSrc.next(!this.showFileInfoSrc.value);
  }
  toggleFileChooserView() {
    this.showFileChooserSrc.next(!this.showFileChooserSrc.value);
  }
  showInfoSuccess(msg: string) {
    if (msg) {
      this.infoMsgSrc.next(msg);
    }
    this.showErrorSrc.next(false);
    this.showSuccessSrc.next(true);
  }
  showInfoError(msg: string) {
    if (msg) {
      this.infoMsgSrc.next(msg);
    }
    this.showSuccessSrc.next(false);
    this.showErrorSrc.next(true);
  }
  closeInfoSuccess() {
    this.showSuccessSrc.next(false);
  }
  closeInfoError() {
    this.showErrorSrc.next(false);
  }
}
