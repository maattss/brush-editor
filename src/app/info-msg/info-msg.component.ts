import { Component, OnInit } from '@angular/core';
import { ViewService } from '../_services';

@Component({
    selector: 'app-info-msg',
    templateUrl: './info-msg.component.html',
    styleUrls: ['./info-msg.component.scss'],
})
export class InfoMsgComponent implements OnInit {
    constructor(private view: ViewService) {}

    // Class variables
    private showSuccess = false;
    private showError = false;
    private infoMsg = '';

    ngOnInit() {
        this.view.showSuccess.subscribe(
            showSuccess => (this.showSuccess = showSuccess)
        );
        this.view.showError.subscribe(
            showError => (this.showError = showError)
        );
        this.view.infoMsg.subscribe(infoMsg => (this.infoMsg = infoMsg));
    }

    closeSuccess() {
        this.view.closeInfoSuccess();
    }
    closeError() {
        this.view.closeInfoError();
    }
}
