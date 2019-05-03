import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ViewService {
    private showSettingsSrc = new BehaviorSubject<boolean>(false);
    private showFileInfoSrc = new BehaviorSubject<boolean>(false);
    private showFileChooserSrc = new BehaviorSubject<boolean>(false);
    private showBrushMappingSrc = new BehaviorSubject<boolean>(false);
    private successMsg: string;
    private errorMsg: string;
    private infoMsgSrc = new BehaviorSubject<string>('');
    private showSuccessSrc = new BehaviorSubject<boolean>(false);
    private showErrorSrc = new BehaviorSubject<boolean>(false);

    showSettings = this.showSettingsSrc.asObservable();
    showFileInfo = this.showFileInfoSrc.asObservable();
    showFileChooser = this.showFileChooserSrc.asObservable();
    showBrushMapping = this.showBrushMappingSrc.asObservable();
    infoMsg = this.infoMsgSrc.asObservable();
    showSuccess = this.showSuccessSrc.asObservable();
    showError = this.showErrorSrc.asObservable();

    constructor() {}

    toggleSettingsView() {
        this.showSettingsSrc.next(!this.showSettingsSrc.value);

        this.showBrushMappingSrc.next(false);
        this.showFileChooserSrc.next(false);
        this.showFileInfoSrc.next(false);
        this.showErrorSrc.next(false);
        this.showSuccessSrc.next(false);
    }
    toggleFileInfoView() {
        this.showFileInfoSrc.next(!this.showFileInfoSrc.value);

        this.showBrushMappingSrc.next(false);
        this.showFileChooserSrc.next(false);
        this.showSettingsSrc.next(false);
        this.showErrorSrc.next(false);
        this.showSuccessSrc.next(false);
    }
    toggleFileChooserView() {
        this.showFileChooserSrc.next(!this.showFileChooserSrc.value);

        this.showBrushMappingSrc.next(false);
        this.showSettingsSrc.next(false);
        this.showFileInfoSrc.next(false);
        this.showErrorSrc.next(false);
        this.showSuccessSrc.next(false);
    }
    toggleBrushMappingView() {
        this.showBrushMappingSrc.next(!this.showBrushMappingSrc.value);

        this.showFileChooserSrc.next(false);
        this.showSettingsSrc.next(false);
        this.showFileInfoSrc.next(false);
        this.showErrorSrc.next(false);
        this.showSuccessSrc.next(false);
    }
    showInfoSuccess(msg: string) {
        if (msg) {
            this.infoMsgSrc.next(msg);
        }
        this.showSuccessSrc.next(true);

        this.showFileChooserSrc.next(false);
        this.showBrushMappingSrc.next(false);
        this.showSettingsSrc.next(false);
        this.showFileInfoSrc.next(false);
        this.showErrorSrc.next(false);
    }
    showInfoError(msg: string) {
        if (msg) {
            this.infoMsgSrc.next(msg);
        }

        this.showErrorSrc.next(true);

        this.showFileChooserSrc.next(false);
        this.showBrushMappingSrc.next(false);
        this.showSettingsSrc.next(false);
        this.showSuccessSrc.next(false);
        this.showFileInfoSrc.next(false);
    }
    closeInfoSuccess() {
        this.showSuccessSrc.next(false);
    }
    closeInfoError() {
        this.showErrorSrc.next(false);
    }
}
